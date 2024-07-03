from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_db


router = APIRouter(
    prefix="/foods",
    tags=["foods"],
    responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=List[schemas.Food])
def read_foods(db: Session = Depends(get_db)):
    return db.query(models.Food).all()


@router.get("/{food_id}", response_model=schemas.Food)
def read_food(food_id: int, db: Session = Depends(get_db)):
    return db.query(models.Food).filter(models.Food.id == food_id).one()


@router.post("/", response_model=schemas.Food)
def create_food(food: schemas.FoodCreate, db: Session = Depends(get_db)):
    food = models.Food(name=food.name, description=food.description, calories_per_100g=food.calories_per_100g)
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


@router.put("/{food_id}")
def update_food(food_id: int, db: Session = Depends(get_db)):
    return {}


@router.delete("/{food_id}")
def delete_food(food_id: int, db: Session = Depends(get_db)):
    pass
