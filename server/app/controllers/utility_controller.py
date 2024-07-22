from datetime import date
from typing import Dict, Union

from fastapi import APIRouter, Query, Depends

from app.dependencies.auth import get_current_user
from app.schemas import user as schemas
from app.utils import calculate_bmr, calculate_tdee


router = APIRouter(
    tags=["utility"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/get-total-daily-energy-expenditure-preview", response_model=Dict[str, int]
)
async def get_total_daily_energy_expenditure_preview(
    gender: str = Query,
    age: int = Query,
    height: float = Query,
    weight: float = Query,
    activity_level: str = Query,
    current_user: schemas.User = Depends(get_current_user),
):
    bmr = calculate_bmr(gender, age, height, weight)
    tdee = calculate_tdee(bmr, activity_level)
    return {"tdee": tdee}


@router.get("/dashboard-info", response_model=Dict[str, Union[float, int]])
async def get_dashboard_info(
    day: date = Query, current_user: schemas.User = Depends(get_current_user)
):
    consumed_calories = 0.0

    # Get consumed calories
    servings = current_user.servings

    for serving in servings:
        if serving.consumed_at.date() == day:
            consumed_calories += serving.quantity * serving.portion.calories

    return {
        "bmr": current_user.bmr,
        "tdee": current_user.tdee,
        "consumed_calories": consumed_calories,
    }
