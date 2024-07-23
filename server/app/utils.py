from typing import Union

from app.enums import (
    ActivityLevelTypes, 
    GenderTypes,
    GoalTypes,
)


def calculate_bmr(gender: Union[str, GenderTypes], age: int, height: float, weight: float) -> int:
    """
    This method will calculate the Basal Metabolic Rate (BMR) of the user
    using the Mifflin-St Jeor Equation
    """
    gender = GenderTypes(gender)
    if gender is GenderTypes.MALE:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    elif gender is GenderTypes.FEMALE:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        raise NotImplementedError

    return round(bmr)


def calculate_tdee(bmr: int, activity_level: Union[str, ActivityLevelTypes]) -> int:
    """
    This method will calculate the Total Daily Energy Expenditure (TDEE)
    using the following equation:

        TDEE = BMR * activity_factor

    where the activity factor is determined by the user's activity level
    """
    activity_level_type = ActivityLevelTypes(activity_level)
    if activity_level_type is ActivityLevelTypes.SEDENTARY:
        activity_factor = 1.2
    elif activity_level_type is ActivityLevelTypes.LIGHT_EXERCISE:
        activity_factor = 1.375
    elif activity_level_type is ActivityLevelTypes.MODERATE_EXERCISE:
        activity_factor = 1.55
    elif activity_level_type is ActivityLevelTypes.HARD_EXERCISE:
        activity_factor = 1.725
    elif activity_level_type is ActivityLevelTypes.EXTREMELY_ACTIVE:
        activity_factor = 1.9
    return round(bmr * activity_factor)


def calculate_goal_calories(tdee: int, goal_type: Union[str, GoalTypes]) -> int:
    """
    This method will calculate the goal calories based on the user's
    Total Daily Energy Expenditure (TDEE) and the goal type
    """
    goal_type = GoalTypes(goal_type)
    if goal_type is GoalTypes.LOSE_WEIGHT:
        goal_calories = tdee * .8
    elif goal_type is GoalTypes.MAINTAIN_WEIGHT:
        goal_calories = tdee
    elif goal_type is GoalTypes.GAIN_WEIGHT:
        goal_calories = tdee * 1.2
    else:
        raise NotImplementedError
    return round(goal_calories)
