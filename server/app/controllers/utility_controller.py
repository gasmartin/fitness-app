from datetime import date
from typing import Dict, Union

from fastapi import APIRouter, Query, Depends

from app.dependencies.auth import get_current_user
from app.schemas import user as schemas
from app.utils import calculate_bmr, calculate_tdee, calculate_goal_calories


router = APIRouter(
    tags=["utility"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/get-goal-calories-preview", response_model=Dict[str, int]
)
async def get_goal_calories_preview(
    gender: str = Query,
    age: int = Query,
    height: float = Query,
    weight: float = Query,
    activity_level: str = Query,
    goal_type: str = Query,
    current_user: schemas.User = Depends(get_current_user),
):
    bmr = calculate_bmr(gender, age, height, weight)
    tdee = calculate_tdee(bmr, activity_level)
    goal_calories = calculate_goal_calories(tdee, goal_type)
    return {"goal_calories": goal_calories}


@router.get("/dashboard-info", response_model=Dict[str, Union[float, int]])
async def get_dashboard_info(
    day: date = Query, current_user: schemas.User = Depends(get_current_user)
):
    consumed_calories = 0.0

    # Get consumed calories
    user_foods = current_user.user_foods

    for user_food in user_foods:
        if user_food.consumed_at.date() == day:
            consumed_calories += user_food.kcal

    return {
        "goal_calories": current_user.goal_calories,
        "consumed_calories": consumed_calories,
    }
