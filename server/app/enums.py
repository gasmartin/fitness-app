from enum import Enum


class Genders(Enum):
    MALE = "M"
    FEMALE = "F"


class ActivityLevels(Enum):
    SEDENTARY = "sedentary"
    LIGHT_EXERCISE = "lightly_active"
    MODERATE_EXERCISE = "moderately_active"
    HARD_EXERCISE = "very_active"
    EXTREMELY_ACTIVE = "extremely_active"


class Goals(Enum):
    LOSE_WEIGHT = "lose_weight"
    MAINTAIN_WEIGHT = "maintain_weight"
    GAIN_WEIGHT = "gain_weight"


class MealTypes(Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
