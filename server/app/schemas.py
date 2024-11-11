from datetime import date, time
from typing import List, Optional

from pydantic import BaseModel

from app.enums import ActivityLevels, Genders, Goals


class SimpleResultMessage(BaseModel):
    message: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
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
    is_admin: bool


class UserCreate(UserBase):
    is_admin: Optional[bool] = None
    password: str


class UserUpdate(UserPhysiology):
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
        

class FoodCreate(BaseFood):
    description: str


class FoodUpdate(BaseFood):
    pass


class FoodSearch:
    id: int
    name: str
    description: str


class FoodRead(BaseFood):
    id: int
    description: str
    serving_sizes: Optional[List[ServingSizeRead]] = []

    class Config:
        from_attributes = True


class WaterIntakeCreate(BaseModel):
    quantity_in_liters: float
    intake_date: date


class WaterIntakeUpdate(BaseModel):
    quantity_in_liters: Optional[float] = None
    intake_date: Optional[date] = None


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
    duration_in_hours: float
    practice_date: date
    exercise_id: int


class ExerciseLogUpdate(BaseModel):
    duration_in_hours: Optional[float] = None
    practice_date: Optional[date] = None
    exercise_id: Optional[int] = None


class ExerciseLogRead(ExerciseLogCreate):
    id: int

    class Config:
        from_attributes = True


class FoodConsumptionCreate(BaseModel):
    quantity: float
    consumption_date: date
    food_id: int
    meal_id: int
    serving_size_id: int


class FoodConsumptionUpdate(BaseModel):
    quantity: Optional[float] = None
    consumption_date: Optional[date] = None
    food_id: Optional[int] = None
    meal_id: Optional[int] = None
    serving_size_id: Optional[int] = None


class FoodConsumptionRead(FoodConsumptionCreate):
    id: int
    food: FoodRead
    meal: MealRead
    serving_size: ServingSizeRead

    class Config:
        from_attributes = True


class ReportCreate(BaseModel):
    report_date: date


class ReportRead(ReportCreate):
    id: int

    class Config:
        from_attributes = True


class UserDailyOverview(BaseModel):
    total_calories_intake: float
    total_water_intake: float
    total_calories_burned: float
    food_consumptions: List[FoodConsumptionRead]
    water_intakes: List[WaterIntakeRead]
    exercise_logs: List[ExerciseLogRead]
