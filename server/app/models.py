import hashlib
from datetime import datetime
from typing import List

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

from app.database import engine
from app.types import ActivityLevelTypes, GenderTypes, GoalTypes, MealTypes

Base = declarative_base()


class TimestampMixin:
    created_at = mapped_column(DateTime, default=datetime.utcnow)
    updated_at = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
 
    # Calculate BMR using Harris-Beneidct equation (revised)
    gender: Mapped[GenderTypes] = mapped_column(Enum(GenderTypes), nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    height: Mapped[float] = mapped_column(nullable=False)
    weight: Mapped[float] = mapped_column(nullable=False)

    # Calculate TDEE
    activity_level: Mapped[ActivityLevelTypes] = mapped_column(Enum(ActivityLevelTypes), nullable=False)

    # User's goal
    goal_type: Mapped[GoalTypes] = mapped_column(Enum(GoalTypes), nullable=False)

    credentials: Mapped["UserCredentials"] = relationship(back_populates="user", cascade="all, delete-orphan")
    
    foods: Mapped[List["Food"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    servings: Mapped[List["Serving"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def bmr(self) -> int:
        """
        This method will calculate the Basal Metabolic Rate (BMR) of the user 
        using the Harris-Beneidct equation revised by Roza and Shizgal in 1984
        """
        if self.gender is GenderTypes.MALE:
            bmr = 88.362 + (13.397 * self.weight) + (4.799 * self.height) + (5.677 * self.age)
        elif self.gender is GenderTypes.FEMALE:
            bmr = 447.593 + (9.247 * self.weight) + (3.098 * self.height) - (4.330 * self.age)
        else:
            raise NotImplementedError

        return round(bmr)

    @property
    def tdee(self) -> int:
        """
        This method will calculate the Total Daily Energy Expenditure (TDEE)
        using the following equation:

            TDEE = BMR * activity_factor
        """
        activity_factor = ActivityLevelTypes(self.activity_level).value
        tdee = self.bmr * activity_factor
        return round(tdee)

    @property
    def goal_calories(self) -> int:
        """
        This method will calculate the calories needed to achieve the user's goal
        """
        if self.goal_type is GoalTypes.LOSE_WEIGHT:
            goal_calories = self.tdee - 500
        elif self.goal_type is GoalTypes.MAINTENANCE:
            goal_calories = self.tdee
        elif self.goal_type is GoalTypes.GAIN_MASS:
            goal_calories = self.tdee + 500
        else:
            raise NotImplementedError

        return round(goal_calories)
    
    def __repr__(self) -> str:
        return f"<User id={self.id} name={self.name} gender={self.gender} age={self.age} height={self.height} weight={self.weight}>"


class UserCredentials(TimestampMixin, Base):
    __tablename__ = "user_credentials"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="credentials")

    def hash_and_set_password(self, password: str) -> str:
        self.hashed_password = hashlib.sha256(password.encode()).hexdigest()

    def check_password(self, password: str) -> bool:
        return self.hashed_password == hashlib.sha256(password.encode()).hexdigest()

    def __repr__(self) -> str:
        return f"<UserCredentials email={self.email}>"


class Food(TimestampMixin, Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    calories: Mapped[float] = mapped_column(nullable=False)  # Calories per 100g
    carbohydrates: Mapped[float] = mapped_column(nullable=False) # Carbohydrates per 100g
    proteins: Mapped[float] = mapped_column(nullable=False)  # Proteins per 100g
    fats: Mapped[float] = mapped_column(nullable=False)  # Fats per 100g

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="foods")

    portions: Mapped[List["Portion"]] = relationship(back_populates="food", cascade="all, delete-orphan")
    servings: Mapped[List["Serving"]] = relationship(back_populates="food", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Food id={self.id} name={self.name} description={self.description} calories={self.calories} carbohydrates={self.carbohydrates} proteins={self.proteins} fats={self.fats}>"


class Portion(TimestampMixin, Base):
    __tablename__ = "portions"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(nullable=False)
    weight_in_grams: Mapped[float] = mapped_column(nullable=False)

    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))
    food: Mapped["Food"] = relationship(back_populates="portions")

    servings: Mapped[List["Serving"]] = relationship(back_populates="portion", cascade="all, delete-orphan")

    @property
    def calories(self) -> float:
        return self.weight_in_grams * self.food.calories / 100

    @property
    def carbohydrates(self) -> float:
        return self.weight_in_grams * self.food.carbohydrates / 100

    @property
    def proteins(self) -> float:
        return self.weight_in_grams * self.food.proteins / 100

    @property
    def fats(self) -> float:
        return self.weight_in_grams * self.food.fats / 100

    def __repr__(self) -> str:
        return f"<Portion id={self.id} name={self.name} weight_in_grams={self.weight_in_grams} calories={self.calories}>"


class Serving(TimestampMixin, Base):
    """
    Class which represents the N:N relationship between users, foods and serving types
    """
    __tablename__ = "servings"

    id: Mapped[int] = mapped_column(primary_key=True)

    quantity: Mapped[float] = mapped_column(nullable=False)
    meal_type: Mapped[MealTypes] = mapped_column(Enum(MealTypes), nullable=False)
    consumed_at = mapped_column(DateTime, default=datetime.utcnow, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"))
    portion_id: Mapped[int] = mapped_column(ForeignKey("portions.id"))

    user: Mapped["User"] = relationship(back_populates="servings")
    food: Mapped["Food"] = relationship(back_populates="servings")
    portion: Mapped["Portion"] = relationship(back_populates="servings")

    @property
    def consumed_calories(self) -> float:
        return self.quantity * self.portion.calories

    def __repr__(self) -> str:
        return f"<Serving id={self.id} quantity={self.quantity}>"


Base.metadata.create_all(bind=engine)
