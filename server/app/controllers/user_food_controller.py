from datetime import date
from typing import Dict, List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.enums import MealTypes
from app.models import Food, UserFood
from app.schemas import user as user_schemas
from app.schemas import user_food as user_food_schemas


router = APIRouter(
    prefix="/user-foods",
    tags=["user-foods"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[Dict[str, Union[MealTypes, List[user_food_schemas.UserFood]]]])
async def get_user_foods(
    day: Optional[date] = Query(None, description="Day to filter user foods"),
    current_user: user_schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_foods = current_user.user_foods

    if day is not None:
        user_foods = [
            user_food for user_food in user_foods if user_food.consumed_at.date() == day
        ]

    user_foods_by_meal_type = {}
    
    # Group user foods by meal type
    for meal_type in MealTypes:
        user_foods_by_meal_type[meal_type] = [
            user_food
            for user_food in user_foods
            if user_food.meal_type == meal_type
        ]

    result_list = []

    for meal_type, user_foods in user_foods_by_meal_type.items():
        result_list.append({"mealType": meal_type, "userFoods": user_foods})

    return result_list


@router.post("/", response_model=user_food_schemas.UserFood)
async def create_user_food(
    user_food: user_food_schemas.UserFoodCreate,
    current_user: user_schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = db.query(Food).filter(Food.id == user_food.food.id).first()
    if food_db is None:
        # Insert food in database
        food_db = Food(**user_food.food.dict())
        db.add(food_db)
        db.flush()

    user_food_db = UserFood(
        **user_food.dict(exclude={"food"}),
        user_id=current_user.id,
        food_id=food_db.id,
    )
    db.add(user_food_db)
    db.commit()
    db.refresh(user_food_db)
    return user_food_db


@router.put("/{user_food_id}", response_model=user_food_schemas.UserFood)
async def update_user_food(
    user_food_id: int,
    user_food: user_food_schemas.UserFoodUpdate,
    current_user: user_schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_food_db = db.query(UserFood).filter(UserFood.id == user_food_id).first()
    if user_food_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Food not found"
        )
    update_data = user_food.dict(exclude_unset=True)
    for field in update_data:
        setattr(user_food_db, field, update_data[field])
    db.commit()
    db.refresh(user_food_db)
    return user_food_db


@router.delete("/{user_food_id}")
async def delete_user_food(
    user_food_id: int,
    current_user: user_schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_food_db = db.query(UserFood).filter(UserFood.id == user_food_id).first()
    if user_food_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Food not found"
        )
    db.delete(user_food_db)
    db.commit()
    return {"message": "User Food deleted successfully"}
