from enum import Enum


class GenderTypes(Enum):
    MALE = "M"
    FEMALE = "F"


class ActivityLevelTypes(Enum):
    SEDENTARY = 1.2
    LIGHT_EXERCISE = 1.375
    MODERATE_EXERCISE = 1.55
    HARD_EXERCISE = 1.725
    ATHLETE = 1.9


class GoalTypes(Enum):
    LOSE_WEIGHT = "lose_weight"
    MAINTENANCE = "maintenance"
    GAIN_MASS = "gain_mass"


class MealTypes(Enum):
    BREAKFAST = "Café da manhã"
    LUNCH = "Almoço"
    DINNER = "Jantar"
    SNACK = "Lanche"
