from datetime import datetime
from typing import List

from sqlalchemy import DateTime, Enum, ForeignKey, Time
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

from app.database import engine
from app.enums import ActivityLevels, Genders, Goals
from app.utils import calculate_bmr, calculate_tdee, calculate_goal_calories

Base = declarative_base()


class TimestampMixin:
    created_at = mapped_column(DateTime, default=datetime.utcnow)
    updated_at = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FoodComponentsMixin:
    calories: Mapped[float] = mapped_column(nullable=True, default=0.0)
    carbohydrates: Mapped[float] = mapped_column(nullable=True, default=0.0)
    proteins: Mapped[float] = mapped_column(nullable=True, default=0.0)
    lipids: Mapped[float] = mapped_column(nullable=True, default=0.0)


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    # Calculate BMR using Mifflin-St Jeor Equation
    gender: Mapped[Genders] = mapped_column(Enum(Genders), nullable=True)
    age: Mapped[int] = mapped_column(nullable=True)
    height: Mapped[int] = mapped_column(nullable=True)
    weight: Mapped[float] = mapped_column(nullable=True)
    activity_level: Mapped[ActivityLevels] = mapped_column(Enum(ActivityLevels), nullable=True)
    goal_type: Mapped[Goals] = mapped_column(Enum(Goals), nullable=True)

    food_consuptions: Mapped[List["FoodConsumption"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    meals: Mapped[List["Meal"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    water_intakes: Mapped[List["WaterIntake"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reports: Mapped[List["Report"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    exercises: Mapped[List["Exercise"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    exercise_logs: Mapped[List["ExerciseLog"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def bmr(self) -> int:
        return calculate_bmr(self.gender, self.age, self.height, self.weight)

    @property
    def tdee(self) -> int:
        return calculate_tdee(self.bmr, self.activity_level)

    @property
    def goal_calories(self) -> int:
        return calculate_goal_calories(self.tdee, self.goal_type)

    def __repr__(self) -> str:
        return f"<User id={self.id} name={self.name} email={self.email}>"


class Meal(TimestampMixin, Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    default_time = mapped_column(Time, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="meals")

    def __repr__(self) -> str:
        return f"<MealType id={self.id} name={self.name} default_time={self.default_time}>"


class Food(TimestampMixin, FoodComponentsMixin, Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)

    serving_sizes: Mapped[List["ServingSize"]] = relationship(back_populates="food", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Food id={self.id} name={self.name} calories={self.calories} carbohydrates={self.carbohydrates} proteins={self.proteins} lipids={self.lipids}>"


class ServingSize(TimestampMixin, FoodComponentsMixin, Base):
    __tablename__ = "serving_sizes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)

    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))
    food: Mapped["Food"] = relationship(back_populates="serving_sizes")

    def __repr__(self) -> str:
        return f"<ServingSize id={self.id} name={self.name} calories={self.calories} carbohydrates={self.carbohydrates} proteins={self.proteins} lipids={self.lipids}>"


class WaterIntake(TimestampMixin, Base):
    __tablename__ = "water_intakes"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity_ml: Mapped[int] = mapped_column(nullable=False)
    date = mapped_column(DateTime, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="water_intakes")

    def __repr__(self) -> str:
        return f"<WaterIntake id={self.id} quantity_ml={self.quantity_ml} date={self.date}>"


class Exercise(TimestampMixin, Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    calories_per_hour: Mapped[int] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="exercises")

    exercise_logs: Mapped[List["ExerciseLog"]] = relationship(back_populates="exercise")

    def __repr__(self) -> str:
        return f"<Exercise id={self.id} name={self.name} calories_per_hour={self.calories_per_hour}>"


class Report(TimestampMixin, Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(nullable=False)
    date = mapped_column(DateTime, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="reports")

    def __repr__(self) -> str:
        return f"<Report id={self.id} content={self.content} date={self.date}>"


class ExerciseLog(TimestampMixin, Base):
    """
    Represents the many-to-many relationship between users and exercises
    """
    __tablename__ = "exercise_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    duration: Mapped[float] = mapped_column(nullable=False)
    date = mapped_column(DateTime, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))

    user: Mapped["User"] = relationship(back_populates="exercise_logs")
    exercise: Mapped["Exercise"] = relationship(back_populates="exercise_logs")

    def __repr__(self) -> str:
        return f"<ExerciseLog id={self.id} duration={self.duration} date={self.date}>"


class FoodConsumption(TimestampMixin, Base):
    __tablename__ = "food_consuptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[float] = mapped_column(nullable=False)
    date = mapped_column(DateTime, default=datetime.utcnow, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"))
    serving_size_id: Mapped[int] = mapped_column(ForeignKey("serving_sizes.id"))

    user: Mapped["User"] = relationship(back_populates="food_consuptions")
    food: Mapped["Food"] = relationship()
    meal: Mapped["Meal"] = relationship()
    serving_size: Mapped["ServingSize"] = relationship()

    @property
    def calories(self) -> int:
        return round(self.serving_size.calories * self.quantity)

    @property
    def carbohydrates(self) -> int:
        return round(self.serving_size.carbohydrates * self.quantity)

    @property
    def proteins(self) -> int:
        return round(self.serving_size.proteins * self.quantity)

    @property
    def lipids(self) -> int:
        return round(self.serving_size.lipids * self.quantity)

    def __repr__(self) -> str:
        return f"<FoodConsumption id={self.id} food_name={self.food.name} calories={self.calories}>"


Base.metadata.create_all(bind=engine)
