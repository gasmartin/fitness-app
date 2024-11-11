from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user, get_db
from app.models import Food
from app.schemas import (
    FoodCreate,
    FoodRead,
    FoodSearch,
    FoodUpdate,
    ServingSizeRead,
    SimpleResultMessage,
    UserRead
)


router = APIRouter(
    prefix="/foods",
    tags=["foods"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=None)
async def get_foods(
    q: Optional[str] = Query(
        None, description="The search term used to filter foods"
    ),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[FoodRead] | List[FoodSearch]:
    if q:
        result = db.query(Food.id, Food.name, Food.description).filter(Food.description.ilike(f"%{q}%")).all()
        return [
            {"id": id, "name": name, "description": description}
            for id, name, description in result
        ]

    return db.query(Food).all()


@router.get("/{food_id}", response_model=FoodRead)
async def get_food(
    food_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food not found"
        )

    return food


@router.post("/", response_model=FoodRead)
def create_food(
    food: FoodCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = Food(**food.dict(), user_id=current_user.id)

    db.add(food_db)
    db.commit()
    db.refresh(food_db)

    return food_db


@router.put("/{food_id}", response_model=FoodRead)
def update_food(
    food_id: int,
    food: FoodUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = db.query(Food).filter(Food.id == food_id).first()

    if not food_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food not found"
        )

    if food_db.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this food"
        )
    
    for key, value in food.dict(exclude_unset=True).items():
        setattr(food_db, key, value)

    db.commit()
    db.refresh(food_db)

    return food_db


@router.delete("/{food_id}", response_model=SimpleResultMessage)
def delete_food(
    food_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = db.query(Food).filter(Food.id == food_id).first()

    if not food_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food not found"
        )

    if food_db.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this food"
        )

    db.delete(food_db)
    db.commit()

    return {"message": "Food deleted successfully"}


@router.get("/{food_id}/serving-sizes", response_model=List[ServingSizeRead])
def get_serving_sizes_by_food_id(
    food_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = db.query(Food).filter(Food.id == food_id).first()

    if not food_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Food not found"
        )

    return food_db.serving_sizes
