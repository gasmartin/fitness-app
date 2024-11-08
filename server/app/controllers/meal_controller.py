from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import Meal
from app.schemas import (
    MealRead,
    MealCreate,
    MealUpdate,
    UserRead,
    SimpleResultMessage,
)


router = APIRouter(
    prefix="/meals",
    tags=["meals"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[MealRead])
def get_meals(
    current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)
):
    return db.query(Meal).filter(Meal.user_id == current_user.id).all()


@router.get("/{meal_id}", response_model=MealRead)
def get_meal_by_id(
    meal_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_db = db.query(Meal).filter(Meal.id == meal_id).first()

    if not meal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Meal not found"
        )

    return meal_db


@router.post("/", response_model=MealRead)
def create_meal(
    meal: MealCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_db = Meal(**meal.dict(), user_id=current_user.id)

    db.add(meal_db)
    db.commit()
    db.refresh(meal_db)

    return meal_db


@router.put("/{meal_id}", response_model=MealRead)
def update_meal(
    meal_id: int,
    meal: MealUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_db = db.query(Meal).filter(Meal.id == meal_id).first()

    if not meal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Meal not found"
        )

    for key, value in meal.dict(exclude_unset=True).items():
        setattr(meal_db, key, value)

    db.commit()
    db.refresh(meal_db)

    return meal_db


@router.delete("/{meal_id}", response_model=SimpleResultMessage)
def delete_meal(
    meal_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_db = db.query(Meal).filter(Meal.id == meal_id).first()

    if not meal_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Meal not found"
        )

    db.delete(meal_db)
    db.commit()

    return {"message": "Meal deleted successfully"}
