from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.enums import MealTypes
from app.schemas.food import Food, FoodCreate


class UserFoodCreate(BaseModel):
    quantity_in_grams: int
    consumed_at: Optional[datetime] = None
    meal_type: MealTypes
    food: FoodCreate


class UserFoodUpdate(BaseModel):
    quantity_in_grams: Optional[int] = None
    meal_type: Optional[MealTypes] = None


class UserFood(UserFoodCreate):
    id: int
    kcal: int
    food: Food

    class Config:
        from_attributes = True
