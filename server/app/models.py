from datetime import datetime
from typing import List

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

from app.database import engine
from app.enums import ActivityLevelTypes, GenderTypes, GoalTypes, MealTypes
from app.utils import calculate_bmr, calculate_tdee, calculate_goal_calories

Base = declarative_base()


class TimestampMixin:
    created_at = mapped_column(DateTime, default=datetime.utcnow)
    updated_at = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    has_provided_info: Mapped[bool] = mapped_column(nullable=False, default=False)

    # Calculate BMR using Mifflin-St Jeor Equation
    gender: Mapped[GenderTypes] = mapped_column(Enum(GenderTypes), nullable=True)
    age: Mapped[int] = mapped_column(nullable=True)
    height: Mapped[float] = mapped_column(nullable=True)
    weight: Mapped[float] = mapped_column(nullable=True)

    activity_level: Mapped[ActivityLevelTypes] = mapped_column(
        Enum(ActivityLevelTypes), nullable=True
    )

    goal_type: Mapped[GoalTypes] = mapped_column(Enum(GoalTypes), nullable=True)

    user_foods: Mapped[List["UserFood"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

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


class Food(TimestampMixin, Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)

    # Nutritional values per 100g
    kcal: Mapped[float] = mapped_column(nullable=True, default=0.0)
    carbohydrates: Mapped[float] = mapped_column(nullable=True, default=0.0)
    protein: Mapped[float] = mapped_column(nullable=True, default=0.0)
    lipids: Mapped[float] = mapped_column(nullable=True, default=0.0)

    user_foods: Mapped[List["UserFood"]] = relationship(
        back_populates="food", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Food id={self.id} name={self.name} kcal={self.kcal} carbohydrates={self.carbohydrates} protein={self.protein} lipids={self.lipids}>"


class UserFood(TimestampMixin, Base):
    """
    Class which represents the N:N relationship between users and foods
    """

    __tablename__ = "users_foods"

    id: Mapped[int] = mapped_column(primary_key=True)

    quantity_in_grams: Mapped[int] = mapped_column(nullable=False)
    meal_type: Mapped[MealTypes] = mapped_column(Enum(MealTypes), nullable=False)
    consumed_at = mapped_column(DateTime, default=datetime.utcnow, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))

    user: Mapped["User"] = relationship(back_populates="user_foods")
    food: Mapped["Food"] = relationship(back_populates="user_foods")

    @property
    def kcal(self) -> int:
        return round(self.food.kcal * (self.quantity_in_grams / 100))

    def __repr__(self) -> str:
        return f"<UserFood id={self.id} user={self.user.name} food={self.food.name} quantity={self.quantity_in_grams} kcal={self.kcal} when={self.consumed_at}>"


Base.metadata.create_all(bind=engine)
