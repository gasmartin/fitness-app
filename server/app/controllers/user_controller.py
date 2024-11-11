import os
from datetime import datetime, date, timedelta
from functools import reduce
from typing import Any, Dict, List, Optional

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session

from app.constants import (
    ACCESS_TOKEN_EXPIRE_IN_MINUTES,
    ALGORITHM,
    DEFAULT_MEALS,
    ENCODING,
    REFRESH_TOKEN_EXPIRE_DAYS,
    SECRET_KEY
)
from app.dependencies.auth import get_current_user, verify_token
from app.dependencies.database import get_db
from app.models import (
    User,
    Food,
    Meal,
    FoodConsumption,
    Exercise,
    ExerciseLog,
    Report,
    WaterIntake,
)
from app.schemas import (
    ExerciseLogRead,
    ExerciseRead,
    FoodRead,
    FoodConsumptionRead,
    MealCreate,
    MealRead,
    ReportRead,
    SimpleResultMessage,
    RefreshTokenRequest,
    RefreshTokenResponse,
    TokenResponse,
    UserCreate,
    UserDailyOverview,
    UserRead,
    UserUpdate,
    WaterIntakeRead,
)

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


def create_token(data: Dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(data: Dict[str, Any]):
    data["type"] = "access"
    return create_token(data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_IN_MINUTES))


def create_refresh_token(data: Dict[str, Any]) -> str:
    data["type"] = "refresh"
    return create_token(data, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))


def verify_password(plain_password: str, hashed_password: str):
    try:
        return bcrypt.checkpw(plain_password.encode(ENCODING), hashed_password.encode(ENCODING))
    except ValueError:
        return False


def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode(ENCODING), bcrypt.gensalt()).decode(ENCODING)


@router.post("/refresh-token", response_model=RefreshTokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    payload = verify_token(request.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token is invalid")

    new_access_token = create_access_token(data={"sub": payload.get("sub")})

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user_db = db.query(User).filter(User.email == form_data.username).first()

    if not user_db or not verify_password(form_data.password, user_db.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {"sub": user_db.email}

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
async def get_current_logged_user(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return current_user


@router.put("/me", response_model=UserRead)
async def update_current_user(
    user: UserUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for key, value in user.dict(exclude_unset=True).items():
        if key == "password":
            key = "hashed_password"
            value = get_password_hash(value)
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.delete("/me", response_model=SimpleResultMessage)
async def delete_current_user(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.delete(current_user)
    db.commit()

    return {"message": "Current user deleted successfully"}


@router.get("/me/exercises", response_model=List[ExerciseRead])
async def get_user_exercises(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Exercise).filter(Exercise.user_id == current_user.id).all()


@router.get("/me/foods", response_model=List[FoodRead])
async def get_user_foods(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Food).filter(Food.user_id == current_user.id).all()


@router.get("/me/meals", response_model=List[MealRead])
async def get_user_meals(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Meal).filter(Meal.user_id == current_user.id).all()


@router.get("/me/reports", response_model=List[ReportRead])
async def get_user_reports(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Report).filter(Report.user_id == current_user.id).all()


@router.get("/me/exercise-logs", response_model=List[ExerciseLogRead])
async def get_user_exercise_logs(
    date: Optional[date] = Query(None, description="Filter exercise logs by date"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(ExerciseLog).filter(ExerciseLog.user_id == current_user.id)

    if date:
        query = query.filter(ExerciseLog.practice_date == date)

    return query.all()


@router.get("/me/water-intakes", response_model=List[WaterIntakeRead])
async def get_user_water_intakes(
    date: Optional[date] = Query(None, description="Filter water intakes by date"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(WaterIntake).filter(WaterIntake.user_id == current_user.id)

    if date:
        query = query.filter(WaterIntake.intake_date == date)

    return query.all()


@router.get("/me/food-consumptions", response_model=List[FoodConsumptionRead])
async def get_user_food_consumptions(
    date: Optional[date] = Query(None, description="Filter food consumptions by date"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(FoodConsumption).filter(FoodConsumption.user_id == current_user.id)

    if date:
        query = query.filter(FoodConsumption.consumption_date == date)

    return query.all()


@router.get("/me/daily-overview", response_model=UserDailyOverview)
async def get_user_daily_overview(
    date: date = Query(description="Date to overview"),
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_consumptions = await get_user_food_consumptions(date, current_user, db)
    water_intakes = await get_user_water_intakes(date, current_user, db)
    exercise_logs = await get_user_exercise_logs(date, current_user, db)

    total_calories_intake = reduce(
        lambda total, fc: total + (fc.serving_size.calories * fc.quantity),
        food_consumptions,
        0.0,
    )
    total_water_intake = reduce(
        lambda total, wi: total + wi.quantity_in_liters, water_intakes, 0.0
    )
    total_calories_burned = reduce(
        lambda total, el: total + (el.duration_in_hours * el.exercise.calories_per_hour),
        exercise_logs,
        0.0,
    )

    return {
        "total_calories_intake": total_calories_intake,
        "total_water_intake": total_water_intake,
        "total_calories_burned": total_calories_burned,
        "food_consumptions": food_consumptions,
        "water_intakes": water_intakes,
        "exercise_logs": exercise_logs,
    }


@router.get("/me/has-provided-physiology-information", response_model=Dict[str, bool])
async def check_physiology_information(
    current_user: UserRead = Depends(get_current_user),
):
    return {"result": current_user.has_physiology_information}


@router.post("/", response_model=TokenResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)

    user_db = User(name=user.name, email=user.email, hashed_password=hashed_password)

    if os.getenv("ENVIRONMENT") != "production":
        # You can set whether the user is admin or not when env is not production
        user_db.is_admin = user.is_admin

    for meal_data in DEFAULT_MEALS:
        meal_data = MealCreate(**meal_data).dict()
        user_db.meals.append(Meal(**meal_data))

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    token_data = {"sub": user_db.email}

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.get("/", response_model=List[UserRead])
async def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/{user_id}", response_model=UserRead)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user_db


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
):
    user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    for key, value in user.dict(exclude_unset=True).items():
        if key == "password":
            key = "hashed_password"
            value = get_password_hash(value)
        setattr(user_db, key, value)

    db.commit()
    db.refresh(user_db)

    return user_db


@router.delete("/{user_id}", response_model=SimpleResultMessage)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user_db)
    db.commit()

    return {"message": "User deleted successfully"}
