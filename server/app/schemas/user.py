from typing import Optional

from pydantic import BaseModel

from app.enums import (
    GenderTypes,
    ActivityLevelTypes,
    GoalTypes,
)


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    name: str
    email: str
    has_provided_info: bool = False
    gender: Optional[GenderTypes] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevelTypes] = None
    goal_type: Optional[GoalTypes] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(UserCreate):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class User(UserBase):
    id: int

    class Config:
        from_attributes = True
