import json
from typing import Union

from app.constants import DEFAULT_EXERCISES, POPULATE_DB_JSON_FILE_PATH
from app.enums import ActivityLevels, Genders, Goals


def calculate_bmr(
    gender: Union[str, Genders], age: int, height: int, weight: float
) -> int:
    """
    This method will calculate the Basal Metabolic Rate (BMR) of the user
    using the Mifflin-St Jeor Equation
    """
    gender = Genders(gender)
    if gender is Genders.MALE:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    elif gender is Genders.FEMALE:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        raise NotImplementedError

    return round(bmr)


def calculate_tdee(bmr: int, activity_level: Union[str, ActivityLevels]) -> int:
    """
    This method will calculate the Total Daily Energy Expenditure (TDEE)
    using the following equation:

        TDEE = BMR * activity_factor

    where the activity factor is determined by the user's activity level
    """
    activity_level_type = ActivityLevels(activity_level)
    if activity_level_type is ActivityLevels.SEDENTARY:
        activity_factor = 1.2
    elif activity_level_type is ActivityLevels.LIGHT_EXERCISE:
        activity_factor = 1.375
    elif activity_level_type is ActivityLevels.MODERATE_EXERCISE:
        activity_factor = 1.55
    elif activity_level_type is ActivityLevels.HARD_EXERCISE:
        activity_factor = 1.725
    elif activity_level_type is ActivityLevels.EXTREMELY_ACTIVE:
        activity_factor = 1.9
    return round(bmr * activity_factor)


def calculate_goal_calories(tdee: int, goal_type: Union[str, Goals]) -> int:
    """
    This method will calculate the goal calories based on the user's
    Total Daily Energy Expenditure (TDEE) and the goal type
    """
    goal_type = Goals(goal_type)
    if goal_type is Goals.LOSE_WEIGHT:
        goal_calories = tdee * 0.8
    elif goal_type is Goals.MAINTAIN_WEIGHT:
        goal_calories = tdee
    elif goal_type is Goals.GAIN_WEIGHT:
        goal_calories = tdee * 1.2
    else:
        raise NotImplementedError
    return round(goal_calories)


def populate_database():
    from app.database import SessionLocal
    from app.models import Exercise, Food, ServingSize

    with open(POPULATE_DB_JSON_FILE_PATH, "r") as json_file:
        food_data = json.load(json_file)

    db = SessionLocal()

    for food_item in food_data:
        food = Food(
            name=food_item["name"],
            description=food_item["description"],
            calories=food_item.get("kcal"),
            carbohydrates=food_item.get("carbohydrates"),
            proteins=food_item.get("protein"),
            lipids=food_item.get("lipids"),
        )

        food.serving_sizes.append(ServingSize(
            name="100g",
            calories=food_item.get("kcal"),
            carbohydrates=food_item.get("carbohydrates"),
            proteins=food_item.get("protein"),
            lipids=food_item.get("lipids"),
        ))

        for serving_size_item in food_item.get("portions", []):
            serving_size = ServingSize(
                name=serving_size_item["name"],
                calories=serving_size_item.get("kcal"),
                carbohydrates=serving_size_item.get("carbohydrates"),
                proteins=serving_size_item.get("protein"),
                lipids=serving_size_item.get("lipids"),
            )
            food.serving_sizes.append(serving_size)

        db.add(food)
    
    for exercise_data in DEFAULT_EXERCISES:
        db.add(Exercise(**exercise_data))

    db.commit()
    db.close()
