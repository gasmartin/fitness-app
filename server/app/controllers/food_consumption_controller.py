from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import FoodConsumption
from app.schemas import (
    FoodConsumptionCreate,
    FoodConsumptionRead,
    FoodConsumptionUpdate,
    SimpleResultMessage,
    UserRead,
)

router = APIRouter(
    prefix="/food-consumptions",
    tags=["food_consumptions"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[FoodConsumptionRead])
def get_food_comsuptions(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(FoodConsumption).all()


@router.get("/{food_consumption_id}", response_model=FoodConsumptionRead)
def get_food_comsuption(
    food_consumption_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_consumption_db = (
        db.query(FoodConsumption)
        .filter(FoodConsumption.id == food_consumption_id)
        .first()
    )

    if not food_consumption_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food consumption not found"
        )

    return food_consumption_db


@router.post("/", response_model=FoodConsumptionRead)
def create_food_consumption(
    food_consumption: FoodConsumptionCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_consumption_db = FoodConsumption(
        **food_consumption.dict(), user_id=current_user.id
    )

    db.add(food_consumption_db)
    db.commit()
    db.refresh(food_consumption_db)

    return food_consumption_db


@router.put("/{food_consumption_id}", response_model=FoodConsumptionRead)
def update_food_consumption(
    food_consumption_id: int,
    food_consumption: FoodConsumptionUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_consumption_db = (
        db.query(FoodConsumption)
        .filter(FoodConsumption.id == food_consumption_id)
        .first()
    )

    if not food_consumption_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food consumption not found"
        )

    for key, value in food_consumption.dict(exclude_unset=True).items():
        setattr(food_consumption_db, key, value)

    db.commit()
    db.refresh(food_consumption_db)

    return food_consumption_db


@router.delete("/{food_consumption_id}", response_model=SimpleResultMessage)
def delete_food_consumption(
    food_consumption_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_consumption_db = (
        db.query(FoodConsumption)
        .filter(FoodConsumption.id == food_consumption_id)
        .first()
    )

    if not food_consumption_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food consumption not found"
        )

    db.delete(food_consumption_db)
    db.commit()

    return {"message": "Food consumption deleted successfully"}
