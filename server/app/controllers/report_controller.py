from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import Report
from app.schemas import (
    ReportCreate,
    ReportRead,
    SimpleResultMessage,
    UserRead,
)


router = APIRouter(
    prefix="/reports",
    tags=["reports"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ReportRead])
async def get_reports(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Report).all()


@router.get("/{report_id}", response_model=ReportRead)
async def get_report_by_id(
    report_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report_db = db.query(Report).filter(Report.id == report_id).first()

    if not report_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    return report_db


@router.post("/", response_model=ReportRead)
async def create_report(
    report: ReportCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report_db = db.query(Report).filter(Report.date == report.date).first()

    if report_db and (
        report_db.user_id != current_user.id and not current_user.is_admin
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create or modify this report",
        )

    content = ""

    # TODO: Build report content here

    if report_db:
        report_db.content = content
    else:
        report_db = Report(date=report.date, content=content, user_id=current_user.id)

        db.add(report_db)

    db.commit()
    db.refresh(report_db)

    return report_db


@router.delete("/{report_id}", response_model=SimpleResultMessage)
async def delete_report(
    report_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report_db = db.query(Report).filter(Report.id == report_id).first()

    if not report_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    if report_db.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this report",
        )

    db.delete(report_db)
    db.commit()

    return {"message": "Report deleted successfully"}
