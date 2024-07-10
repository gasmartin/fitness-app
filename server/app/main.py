from datetime import datetime, date
from typing import Dict, List, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, UserCredentials, Food, Portion, Serving
from app.types import ActivityLevelTypes, GenderTypes, GoalTypes, MealTypes
from app.utils import calculate_bmr, calculate_goal_calories, calculate_tdee

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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db)):
    """
    Auxiliary method to get the user with ID = 1
    """
    return db.query(User).filter(User.id == 1).one()


class UserCredentialsBase(BaseModel):
    email: str


class UserCredentialsCreate(UserCredentialsBase):
    password: str


class UserCredentialsRead(UserCredentialsBase):
    class Config:
        from_attributes = True


class UserBase(BaseModel):
    name: str
    gender: GenderTypes
    age: int
    height: float
    weight: float
    activity_level: ActivityLevelTypes
    goal_type: GoalTypes


class UserCreate(UserBase, UserCredentialsCreate):
    pass


class UserUpdate(UserBase, UserCredentialsCreate):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    gender: Optional[GenderTypes] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevelTypes] = None
    goal_type: Optional[GoalTypes] = None


class UserRead(UserBase):
    id: int
    bmr: int
    tdee: int
    goal_calories: int
    credentials: UserCredentialsRead

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
    user_id: int
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


@app.on_event("startup")
def on_startup(db: Session = Depends(get_db)):
    foods = [
        {
            "name": "",
            "description": "",
            "calories": 0.0,
            "carbohydrates": 0.0,
            "proteins": 0.0,
            "fats": 0.0,
            "portions": [
                {}
            ],
        }
    ]


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.post("/users", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    credentials_db = (
        db.query(UserCredentials).filter(UserCredentials.email == user.email).first()
    )
    if credentials_db is not None:
        raise HTTPException(status_code=409, detail="Email is already being used!")

    credentials_db = UserCredentials(email=user.email)
    credentials_db.hash_and_set_password(password=user.password)

    user_db = User(
        name=user.name,
        gender=GenderTypes(user.gender),
        age=user.age,
        height=user.height,
        weight=user.weight,
        activity_level=ActivityLevelTypes(user.activity_level),
        goal_type=GoalTypes(user.goal_type),
        credentials=credentials_db,
    )

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    return user_db


@app.get("/users", response_model=List[UserRead])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db


@app.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name is not None:
        user_db.name = user_data.name
    if user_data.gender is not None:
        user_db.gender = user_data.gender
    if user_data.age is not None:
        user_db.age = user_data.age
    if user_data.height is not None:
        user_db.height = user_data.height
    if user_data.weight is not None:
        user_db.weight = user_data.weight
    if user_data.activity_level is not None:
        user_db.activity_level = user_data.activity_level
    if user_data.goal_type is not None:
        user_db.goal_type = user_data.goal_type
    if user_data.email is not None:
        user_db.credentials.email = user_data.email
    if user_data.password is not None:
        user_db.credentials.password = user_data.password

    db.commit()
    db.refresh(user_db)

    return user_db


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
):
    bmr = calculate_bmr(gender, age, height, weight)
    tdee = calculate_tdee(bmr, activity_level)
    goal_calories = calculate_goal_calories(tdee, goal_type)
    return {"goal_calories": goal_calories}


@app.get("/users/{user_id}/summary", response_model=UserDailySummaryResponse)
def get_user_daily_summary(user_id: int, day: date, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")

    query = (
        db.query(Serving)
        .filter(Serving.user_id == user_id, func.date(Serving.consumed_at) == day)
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
        "target_calories": user_db.goal_calories,
        "current_calories": round(current_calories),
        "daily_calories_progress": round(
            current_calories / user_db.goal_calories * 100
        ),
        "carbohydrates": round(carbohydrates),
        "proteins": round(proteins),
        "fats": round(fats),
    }


@app.get(
    "/users/{user_id}/servings",
    response_model=List[Dict[str, Union[MealTypes, List[ServingRead]]]],
)
def get_servings_by_user_id(user_id: int, day: date, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")

    query = (
        db.query(Serving)
        .filter(Serving.user_id == user_id, func.date(Serving.consumed_at) == day)
        .all()
    )

    servings_by_meal_type = {meal_type: [] for meal_type in MealTypes}

    for serving in query:
        servings_by_meal_type[serving.meal_type].append(serving)

    return [
        {"mealType": key, "servings": value}
        for key, value in servings_by_meal_type.items()
    ]


@app.get("/users/{user_id}/finish-day", response_model=FinishDayResponse)
def finish_day(user_id: int, day: date, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")

    query = (
        db.query(Serving)
        .filter(Serving.user_id == user_id, func.date(Serving.consumed_at) == day)
        .all()
    )

    current_calories = 0.0

    for serving in query:
        current_calories += serving.quantity * serving.portion.calories

    if current_calories < user_db.goal_calories:
        return {
            "message": "You have not reached your goal calories for today. However, you can still eat more!"
        }
    elif current_calories > user_db.goal_calories:
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
    name: Optional[str] = Query(None, description="Name of the food to search for"),
    description: Optional[str] = Query(
        None, description="Description of the food to search for"
    ),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = db.query(Food)

    if name is not None:
        query = query.filter(Food.name.ilike(f"%{name}%"))
    if description is not None:
        query = query.filter(Food.description.ilike(f"%{description}%"))

    return query.offset(skip).limit(limit).all()


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
def create_serving(serving_data: ServingCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == serving_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

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
        user_id=serving_data.user_id,
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
