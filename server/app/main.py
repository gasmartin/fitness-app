from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.constants import (
    ACCESS_TOKEN_EXPIRE_IN_MINUTES,
    ALGORITHM,
    SECRET_KEY,
)
from app.database import SessionLocal
from app.models import User, Food, Portion, Serving
from app.types import ActivityLevelTypes, GenderTypes, GoalTypes, MealTypes
from app.utils.auth import get_password_hash, verify_password
from app.utils.nutrition import calculate_bmr, calculate_goal_calories, calculate_tdee

app = FastAPI(title="Fitness app server", version="1.0.0")

origins = [
    "http://localhost",
    "http://192.168.25.42:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


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


class UserFormData(BaseModel):
    gender: GenderTypes
    age: int
    height: float
    weight: float
    activity_level: ActivityLevelTypes
    goal_type: GoalTypes


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class PortionBase(BaseModel):
    name: str
    weight_in_grams: float


class PortionCreate(PortionBase):
    food_id: Optional[int] = None


class PortionUpdate(PortionBase):
    id: Optional[int] = None
    name: Optional[str] = None
    weight_in_grams: Optional[float] = None


class PortionRead(PortionBase):
    id: int
    calories: float

    class Config:
        from_attributes = True


class FoodBase(BaseModel):
    name: str
    description: Optional[str] = None
    calories: float
    carbohydrates: float
    proteins: float
    fats: float


class FoodCreate(FoodBase):
    portions: Optional[List[PortionCreate]] = []


class FoodUpdate(FoodBase):
    name: Optional[str] = None
    calories: Optional[float] = None
    carbohydrates: Optional[float] = None
    proteins: Optional[float] = None
    fats: Optional[float] = None
    portions: Optional[List[PortionUpdate]] = []


class FoodRead(FoodBase):
    id: int
    portions: Optional[List[PortionRead]] = None

    class Config:
        from_attributes = True


class ServingBase(BaseModel):
    quantity: float
    meal_type: MealTypes
    consumed_at: Optional[datetime]


class ServingCreate(ServingBase):
    food_id: int
    portion_id: int


class ServingUpdate(ServingBase):
    quantity: Optional[float] = None
    meal_type: Optional[MealTypes] = None
    portion_id: Optional[int] = None


class ServingRead(ServingBase):
    id: int
    consumed_calories: float
    food: FoodRead
    portion: PortionRead

    class Config:
        from_attributes = True


class UserDailySummaryResponse(BaseModel):
    target_calories: int
    current_calories: int
    daily_calories_progress: int
    carbohydrates: int
    proteins: int
    fats: int


class FinishDayResponse(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta is not None:
        expire = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_user_with_info(current_user: User = Depends(get_current_user)):
    if not current_user.has_provided_info:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has not provided info")
    return current_user


@app.on_event("startup")
def register_foods():
    food_data = [
        {
            "name": "Apple",
            "description": "An apple a day keeps the doctor away.",
            "calories": 52.0,
            "carbohydrates": 14.0,
            "proteins": 0.3,
            "fats": 0.2,
            "portions": [
                {"name": "Small", "weight_in_grams": 100.0},
                {"name": "Medium", "weight_in_grams": 150.0},
                {"name": "Large", "weight_in_grams": 200.0},
            ],
        },
        {
            "name": "Banana",
            "description": "A banana is an edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa.",
            "calories": 89.0,
            "carbohydrates": 23.0,
            "proteins": 1.1,
            "fats": 0.3,
            "portions": [
                {"name": "Small", "weight_in_grams": 100.0},
                {"name": "Medium", "weight_in_grams": 150.0},
                {"name": "Large", "weight_in_grams": 200.0},
            ],
        },
        {
            "name": "Orange",
            "description": "The orange is the fruit of various citrus species in the family Rutaceae; it primarily refers to Citrus sinensis, which is also called sweet orange, to distinguish it from the related Citrus aurantium, referred to as bitter orange.",
            "calories": 47.0,
            "carbohydrates": 12.0,
            "proteins": 1.0,
            "fats": 0.2,
            "portions": [
                {"name": "Small", "weight_in_grams": 100.0},
                {"name": "Medium", "weight_in_grams": 150.0},
                {"name": "Large", "weight_in_grams": 200.0},
            ],
        },
        {
            "name": "Grape",
            "description": "A grape is a fruit, botanically a berry, of the deciduous woody vines of the flowering plant genus Vitis.",
            "calories": 69.0,
            "carbohydrates": 18.0,
            "proteins": 0.7,
            "fats": 0.2,
            "portions": [
                {"name": "Small", "weight_in_grams": 100.0},
                {"name": "Medium", "weight_in_grams": 150.0},
                {"name": "Large", "weight_in_grams": 200.0},
            ],
        },
    ]

    db = SessionLocal()

    try:
        for food in food_data:
            food_db = Food(
                name=food["name"],
                description=food["description"],
                calories=food["calories"],
                carbohydrates=food["carbohydrates"],
                proteins=food["proteins"],
                fats=food["fats"],
                user_id=1,
                portions=[],
            )

            db.add(food_db)
            db.flush()

            for portion in food["portions"]:
                portion_db = Portion(
                    name=portion["name"],
                    weight_in_grams=portion["weight_in_grams"],
                    food_id=food_db.id,
                )
                food_db.portions.append(portion_db)
            
            db.commit()
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(form_data.username, form_data.password)
    
    user_db = db.query(User).filter(User.email == form_data.username).first()
    if user_db is None or not verify_password(form_data.password, user_db.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_IN_MINUTES)
    access_token = create_access_token(
        data={"sub": user_db.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/check-token")
async def check_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token is invalid or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return {"message": "Token is valid"}
    except JWTError:
        raise credentials_exception


@app.get("/users/me", response_model=UserRead)
async def read_users_me(current_user: UserRead = Depends(get_current_user)):
    return current_user


@app.post("/users", response_model=Token)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_db = User(
        name=user.name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
    )

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_IN_MINUTES)
    access_token = create_access_token(
        data={"sub": user_db.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users", response_model=List[UserRead])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db


@app.put("/users/me", response_model=UserRead)
def update_user_info(user_data: UserFormData, current_user: UserRead = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_data.gender is not None:
        current_user.gender = user_data.gender
    if user_data.age is not None:
        current_user.age = user_data.age
    if user_data.height is not None:
        current_user.height = user_data.height
    if user_data.weight is not None:
        current_user.weight = user_data.weight
    if user_data.activity_level is not None:
        current_user.activity_level = user_data.activity_level
    if user_data.goal_type is not None:
        current_user.goal_type = user_data.goal_type

    current_user.has_provided_info = True

    db.commit()
    db.refresh(current_user)

    return current_user


@app.delete("/users/{user_id}", response_model=Dict[str, str])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user_db)
    db.commit()
    return {"message": "User deleted successfully"}


@app.get("/get-goal-calories-preview", response_model=Dict[str, int])
def get_goal_calories_preview(
    gender: str = Query,
    age: int = Query,
    height: float = Query,
    weight: float = Query,
    activity_level: str = Query,
    goal_type: str = Query,
    current_user: UserRead = Depends(get_current_user),
):
    bmr = calculate_bmr(gender, age, height, weight)
    tdee = calculate_tdee(bmr, activity_level)
    goal_calories = calculate_goal_calories(tdee, goal_type)
    return {"goal_calories": goal_calories}


@app.get("/get-daily-summary", response_model=UserDailySummaryResponse)
def get_daily_summary(day: date, current_user: UserRead = Depends(get_current_user_with_info), db: Session = Depends(get_db)):
    query = (
        db.query(Serving)
        .filter(Serving.user_id == current_user.id, func.date(Serving.consumed_at) == day)
        .all()
    )

    current_calories = 0.0
    carbohydrates = 0.0
    proteins = 0.0
    fats = 0.0

    for serving in query:
        current_calories += serving.quantity * serving.portion.calories
        carbohydrates += serving.quantity * serving.portion.carbohydrates
        proteins += serving.quantity * serving.portion.proteins
        fats += serving.quantity * serving.portion.fats

    return {
        "target_calories": current_user.goal_calories,
        "current_calories": round(current_calories),
        "daily_calories_progress": round(
            current_calories / current_user.goal_calories * 100
        ),
        "carbohydrates": round(carbohydrates),
        "proteins": round(proteins),
        "fats": round(fats),
    }


@app.get("/get-daily-servings", response_model=List[Dict[str, Union[MealTypes, List[ServingRead]]]])
def get_daily_servings(day: date, current_user: UserRead = Depends(get_current_user_with_info), db: Session = Depends(get_db)):
    query = (
        db.query(Serving)
        .filter(Serving.user_id == current_user.id, func.date(Serving.consumed_at) == day)
        .all()
    )

    servings_by_meal_type = {meal_type: [] for meal_type in MealTypes}

    for serving in query:
        servings_by_meal_type[serving.meal_type].append(serving)

    return [
        {"mealType": key, "servings": value}
        for key, value in servings_by_meal_type.items()
    ]


@app.get("/finish-day", response_model=FinishDayResponse)
def finish_day(day: date, current_user: UserRead = Depends(get_current_user_with_info), db: Session = Depends(get_db)):
    query = (
        db.query(Serving)
        .filter(Serving.user_id == current_user.id, func.date(Serving.consumed_at) == day)
        .all()
    )

    current_calories = 0.0

    for serving in query:
        current_calories += serving.quantity * serving.portion.calories

    if current_calories < current_user.goal_calories:
        return {
            "message": "You have not reached your goal calories for today. However, you can still eat more!"
        }
    elif current_calories > current_user.goal_calories:
        return {
            "message": "You have exceeded your goal calories for today. Be careful with your diet!"
        }
    else:
        return {
            "message": "Congratulations! You have reached your goal calories for today!"
        }


@app.post("/foods", response_model=FoodRead)
def create_food(
    food: FoodCreate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    food_db = Food(
        name=food.name,
        description=food.description,
        calories=food.calories,
        carbohydrates=food.carbohydrates,
        proteins=food.proteins,
        fats=food.fats,
        user_id=current_user.id,
        portions=[],
    )

    db.add(food_db)
    db.flush()

    for portion in food.portions:
        portion_db = Portion(
            name=portion.name,
            weight_in_grams=portion.weight_in_grams,
            food_id=food_db.id,
        )
        food_db.portions.append(portion_db)

    db.commit()
    db.refresh(food_db)

    return food_db


@app.get("/foods", response_model=List[FoodRead])
def read_foods(
    search_query: Optional[str] = Query(None, description="Query to search for foods"),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    result = db.query(Food)

    if search_query is not None:
        result = result.filter(Food.name.ilike(f"%{search_query}%"))

    return result.offset(skip).limit(limit).all()


@app.get("/foods/{food_id}", response_model=FoodRead)
def read_food(food_id: int, db: Session = Depends(get_db)):
    food_db = db.query(Food).filter(Food.id == food_id).first()
    if food_db is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return food_db


@app.put("/foods/{food_id}", response_model=FoodRead)
def update_food(food_id: int, food_data: FoodUpdate, db: Session = Depends(get_db)):
    food_db = db.query(Food).filter(Food.id == food_id).first()
    if food_db is None:
        raise HTTPException(status_code=404, detail="Food not found")

    if food_data.name is not None:
        food_db.name = food_data.name
    if food_data.description is not None:
        food_db.description = food_data.description
    if food_data.calories is not None:
        food_db.calories = food_data.calories
    if food_data.carbohydrates is not None:
        food_db.carbohydrates = food_data.carbohydrates
    if food_data.proteins is not None:
        food_db.proteins = food_data.proteins
    if food_data.fats is not None:
        food_db.fats = food_data.fats

    if food_data.portions is not None:
        for portion_data in food_data.portions:
            if portion_data.id is not None:
                portion_db = (
                    db.query(Portion).filter(Portion.id == portion_data.id).first()
                )
                if portion_db is None:
                    raise HTTPException(status_code=404, detail="Portion not found")

                if portion_data.name is not None:
                    portion_db.name = portion_data.name
                if portion_data.weight_in_grams is not None:
                    portion_db.weight_in_grams = portion_data.weight_in_grams
            else:
                portion_db = Portion(
                    name=portion_data.name,
                    weight_in_grams=portion_data.weight_in_grams,
                    food_id=food_db.id,
                )
                db.add(portion_db)
                food_db.portions.append(portion_db)

    db.commit()
    db.refresh(food_db)

    return food_db


@app.delete("/foods/{food_id}", response_model=Dict[str, str])
def delete_food(food_id: int, db: Session = Depends(get_db)):
    food_db = db.query(Food).filter(Food.id == food_id).first()
    if food_db is None:
        raise HTTPException(status_code=404, detail="Food not found")
    db.delete(food_db)
    db.commit()
    return {"message": "Food deleted successfully"}


@app.post("/portions", response_model=PortionRead)
def create_portion(portion_data: PortionCreate, db: Session = Depends(get_db)):
    food_db = db.query(Food).filter(Food.id == portion_data.food_id).first()
    if food_db is None:
        raise HTTPException(status_code=404, detail="Food not found")

    portion = Portion(
        name=portion_data.name,
        weight_in_grams=portion_data.weight_in_grams,
        food_id=portion_data.food_id,
    )

    db.add(portion)
    db.commit()
    db.refresh(portion)

    return portion


@app.get("/portions", response_model=List[PortionRead])
def read_portions(db: Session = Depends(get_db)):
    return db.query(Portion).all()


@app.get("/portions/{portion_id}", response_model=PortionRead)
def read_portion(portion_id: int, db: Session = Depends(get_db)):
    portion_db = db.query(Portion).filter(Portion.id == portion_id).first()
    if portion_db is None:
        raise HTTPException(status_code=404, detail="Portion not found")
    return portion_db


@app.put("/portions/{portion_id}", response_model=PortionRead)
def update_portion(
    portion_id: int, portion_data: PortionUpdate, db: Session = Depends(get_db)
):
    portion_db = db.query(Portion).filter(Portion.id == portion_id).first()
    if portion_db is None:
        raise HTTPException(status_code=404, detail="Portion not found")

    if portion_data.name is not None:
        portion_db.name = portion_data.name
    if portion_data.weight_in_grams is not None:
        portion_db.weight_in_grams = portion_data.weight_in_grams

    db.commit()
    db.refresh(portion_db)

    return portion_db


@app.delete("/portions/{portion_id}", response_model=Dict[str, str])
def delete_portion(portion_id: int, db: Session = Depends(get_db)):
    portion_db = db.query(Portion).filter(Portion.id == portion_id).first()
    if portion_db is None:
        raise HTTPException(status_code=404, detail="Portion not found")
    db.delete(portion_db)
    db.commit()
    return {"message": "Portion deleted successfully"}


@app.post("/servings", response_model=ServingRead)
def create_serving(serving_data: ServingCreate, current_user: UserRead = Depends(get_current_user_with_info), db: Session = Depends(get_db)):
    # Check if food exists
    food = db.query(Food).filter(Food.id == serving_data.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    # Check if portion exists
    portion = db.query(Portion).filter(Portion.id == serving_data.portion_id).first()
    if not portion:
        raise HTTPException(status_code=404, detail="Portion not found")

    serving_db = Serving(
        quantity=serving_data.quantity,
        meal_type=serving_data.meal_type,
        consumed_at=serving_data.consumed_at,
        user_id=current_user.id,
        food_id=serving_data.food_id,
        portion_id=serving_data.portion_id,
    )

    db.add(serving_db)
    db.commit()
    db.refresh(serving_db)

    return serving_db


@app.get("/servings", response_model=List[ServingRead])
def read_servings(db: Session = Depends(get_db)):
    return db.query(Serving).all()


@app.get("/servings/{serving_id}", response_model=ServingRead)
def read_serving(serving_id: int, db: Session = Depends(get_db)):
    serving_db = db.query(Serving).filter(Serving.id == serving_id).first()
    if serving_db is None:
        raise HTTPException(status_code=404, detail="Serving not found")
    return serving_db


@app.put("/servings/{serving_id}", response_model=ServingRead)
def update_serving(
    serving_id: int, serving_data: ServingUpdate, db: Session = Depends(get_db)
):
    serving_db = db.query(Serving).filter(Serving.id == serving_id).first()
    if serving_db is None:
        raise HTTPException(status_code=404, detail="Serving not found")

    if serving_data.quantity is not None:
        serving_db.quantity = serving_data.quantity
    if serving_data.meal_type is not None:
        serving_db.meal_type = serving_data.meal_type
    if serving_data.portion_id is not None:
        serving_db.portion_id = serving_data.portion_id

    db.commit()
    db.refresh(serving_db)

    return serving_db


@app.delete("/servings/{serving_id}", response_model=ServingRead)
def delete_serving(serving_id: int, db: Session = Depends(get_db)):
    serving_db = db.query(Serving).filter(Serving.id == serving_id).first()
    if serving_db is None:
        raise HTTPException(status_code=404, detail="Serving not found")
    db.delete(serving_db)
    db.commit()
    return serving_db
