from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import WaterIntake
from app.schemas import (
    UserRead,
    WaterIntakeRead,
    WaterIntakeCreate,
    WaterIntakeUpdate,
    SimpleResultMessage
)


router = APIRouter(
    prefix="/water-intakes",
    tags=["water_intakes"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[WaterIntakeRead])
def get_water_intakes(current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(WaterIntake).all()


@router.get("/{water_intake_id}", response_model=WaterIntakeRead)
def get_water_intake(water_intake_id: int, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    water_intake_db = db.query(WaterIntake).filter(WaterIntake.id == water_intake_id).first()

    if not water_intake_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water intake not found")

    return water_intake_db


@router.post("/", response_model=WaterIntakeRead)
def create_water_intake(water_intake: WaterIntakeCreate, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    water_intake_db = WaterIntake(**water_intake.dict(), user_id=current_user.id)

    db.add(water_intake_db)
    db.commit()
    db.refresh(water_intake_db)

    return water_intake_db


@router.put("/{water_intake_id}", response_model=WaterIntakeRead)
def update_water_intake(water_intake_id: int, water_intake: WaterIntakeUpdate, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    water_intake_db = db.query(WaterIntake).filter(WaterIntake.id == water_intake_id).first()

    if not water_intake_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water intake not found")
    
    for key, value in water_intake.dict(exclude_unset=True).items():
        setattr(water_intake_db, key, value)
    
    db.commit()
    db.refresh(water_intake_db)

    return water_intake_db


@router.delete("/{water_intake_id}", response_model=SimpleResultMessage)
def delete_water_intake(water_intake_id: int, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    water_intake_db = db.query(WaterIntake).filter(WaterIntake.id == water_intake_id).first()

    if not water_intake_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water intake not found")

    db.delete(water_intake_db)
    db.commit()

    return {"message": "Water intake deleted successfully"}
