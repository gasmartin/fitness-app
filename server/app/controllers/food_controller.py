from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user, get_db
from app.models import Food
from app.schemas import (
    FoodRead,
    ServingSizeRead,
    UserRead
)


router = APIRouter(
    prefix="/foods",
    tags=["foods"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[FoodRead])
async def get_foods(
    search_term: Optional[str] = Query(None, description="The search term used to filter foods"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Food)

    if search_term:
        query = query.filter(Food.description.ilike(f"%{search_term}%"))

    return query.all()


@router.get("/{food_id}", response_model=FoodRead)
async def get_food(
    food_id: int, 
    current_user: UserRead = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food not found")
    
    return food


@router.get("/{food_id}/serving-sizes", response_model=List[ServingSizeRead])
def get_serving_sizes_by_food_id(food_id: int, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    food_db = db.query(Food).filter(Food.id == food_id).first()

    if not food_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food not found")

    return food_db.serving_sizes
