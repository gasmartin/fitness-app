from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import ExerciseLog
from app.schemas import (
    ExerciseLogCreate,
    ExerciseLogRead,
    ExerciseLogUpdate,
    SimpleResultMessage,
    UserRead,
)


router = APIRouter(
    prefix="/exercise-logs",
    tags=["exercise_logs"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ExerciseLogRead])
def get_exercise_logs(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(ExerciseLog).all()


@router.get("/{exercise_log_id}", response_model=ExerciseLogRead)
def get_exercise_log_by_id(
    exercise_log_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exercise_log_db = (
        db.query(ExerciseLog).filter(ExerciseLog.id == exercise_log_id).first()
    )

    if not exercise_log_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise log not found"
        )

    return exercise_log_db


@router.post("/", response_model=ExerciseLogRead)
def create_exercise_log(
    exercise_log: ExerciseLogCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exercise_log_db = ExerciseLog(**exercise_log.dict(), user_id=current_user.id)

    db.add(exercise_log_db)
    db.commit()
    db.refresh(exercise_log_db)

    return exercise_log_db


@router.put("/{exercise_log_id}", response_model=ExerciseLogRead)
def update_exercise_log(
    exercise_log_id: int,
    exercise_log: ExerciseLogUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exercise_log_db = (
        db.query(ExerciseLog).filter(ExerciseLog.id == exercise_log_id).first()
    )

    if not exercise_log_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise log not found"
        )

    if exercise_log_db.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permision to delete this exercise log",
        )

    for key, value in exercise_log.dict(exclude_unset=True).items():
        setattr(exercise_log_db, key, value)

    db.commit()
    db.refresh(exercise_log_db)

    return exercise_log_db


@router.delete("/{exercise_log_id}", response_model=SimpleResultMessage)
def delete_exercise_log(
    exercise_log_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exercise_log_db = (
        db.query(ExerciseLog).filter(ExerciseLog.id == exercise_log_id).first()
    )

    if not exercise_log_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise log not found"
        )

    if exercise_log_db.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permision to delete this exercise log",
        )

    db.delete(exercise_log_db)
    db.commit()

    return {"message": "Exercise log deleted successfully"}
