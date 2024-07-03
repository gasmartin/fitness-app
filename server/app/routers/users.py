from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import dependencies, models, schemas


router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)


@router.post("/", response_model=schemas.User)
def create_user(
    user_data: schemas.UserCreate, 
    db: Session = Depends(dependencies.get_db)
):
    user = models.User(**user_data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=schemas.UserWithAdditionalProperties)
def get_current_user(
    current_user: schemas.User = Depends(dependencies.get_current_user)
):
    return {
        **current_user.to_dict(),
        "bmr": current_user.calculate_bmr(round=True),
        "tdee": current_user.calculate_tdee(round=True),
        "goal_calories": current_user.calculate_goal_calories(round=True)
    }
