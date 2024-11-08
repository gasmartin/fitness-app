from datetime import datetime, time
from typing import List, Optional

from pydantic import BaseModel

from app.enums import ActivityLevels, Genders, Goals, MealTypes


class SimpleResultMessage(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserPhysiology(BaseModel):
    gender: Optional[Genders] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevels] = None
    goal_type: Optional[Goals] = None


class UserBase(UserPhysiology):
    name: str
    email: str


class UserCreate(UserBase):
    password: str


class UserUpdate(UserCreate):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class MealCreate(BaseModel):
    name: str
    default_time: time


class MealUpdate(BaseModel):
    name: Optional[str] = None
    default_time: Optional[time] = None


class MealRead(MealCreate):
    id: int

    class Config:
        from_attributes = True


class BaseFood(BaseModel):
    name: str
    calories: Optional[float]
    carbohydrates: Optional[float]
    proteins: Optional[float]
    lipids: Optional[float]


class ServingSizeRead(BaseFood):
    id: int
    
    class Config:
        from_attributes = True


class FoodRead(BaseFood):
    id: int
    description: str
    serving_sizes: Optional[List[ServingSizeRead]] = []

    class Config:
        from_attributes = True


class WaterIntakeCreate(BaseModel):
    quantity_ml: int
    date: datetime


class WaterIntakeUpdate(BaseModel):
    quantity_ml: Optional[int] = None
    date: Optional[datetime] = None


class WaterIntakeRead(WaterIntakeCreate):
    id: int

    class Config:
        from_attributes = True


class ExerciseCreate(BaseModel):
    name: str
    calories_per_hour: int


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    calories_per_hour: Optional[int] = None


class ExerciseRead(ExerciseCreate):
    id: int

    class Config:
        from_attributes = True


class ExerciseLogCreate(BaseModel):
    duration: float
    date: datetime


class ExerciseLogUpdate(BaseModel):
    duration: Optional[float] = None
    date: Optional[datetime] = None


class ExerciseLogRead(ExerciseLogCreate):
    id: int

    class Config:
        from_attributes = True
