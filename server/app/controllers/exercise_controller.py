from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models import Exercise
from app.schemas import (
    UserRead,
    ExerciseRead,
    ExerciseCreate,
    ExerciseUpdate,
    SimpleResultMessage
)


router = APIRouter(
    prefix="/exercises",
    tags=["exercises"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ExerciseRead])
async def get_exercises(current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Exercise).all()


@router.get("/me", response_model=List[ExerciseRead])
def get_user_exercises(current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Exercise).filter(Exercise.user_id == current_user.id).all()


@router.get("/{exercise_id}", response_model=ExerciseRead)
async def get_exercise_by_id(exercise_id: int, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_db = db.query(Exercise).filter(Exercise.id == exercise_id).first()

    if not exercise_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    return exercise_db


@router.post("/", response_model=ExerciseRead)
def create_exercise(exercise: ExerciseCreate, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_db = Exercise(**exercise.dict(), user_id=current_user.id)

    db.add(exercise_db)
    db.commit()
    db.refresh(exercise_db)

    return exercise_db


@router.put("/{exercise_id}", response_model=ExerciseRead)
def update_exercise(exercise_id: int, exercise: ExerciseUpdate, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_db = db.query(Exercise).filter(Exercise.id == exercise_id).first()

    if not exercise_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    for key, value in exercise.dict(exclude_unset=True).items():
        setattr(exercise_db, key, value)

    db.commit()
    db.refresh(exercise_db)

    return exercise_db


@router.delete("/{exercise_id}", response_model=SimpleResultMessage)
async def delete_exercise(exercise_id: int, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_db = db.query(Exercise).filter(Exercise.id == exercise_id).first()

    if not exercise_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    db.delete(exercise_db)
    db.commit()

    return {"message": "Exercise deleted successfully"}
