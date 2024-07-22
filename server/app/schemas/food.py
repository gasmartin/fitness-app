from typing import Optional

from pydantic import BaseModel    


class FoodGraphQL(BaseModel):
    id: int
    name: str
    kcal: Optional[float] = 0.0
    carbohydrates: Optional[float] = 0.0
    protein: Optional[float] = 0.0
    lipids: Optional[float] = 0.0


class FoodCreate(FoodGraphQL):
    pass


class Food(FoodCreate):
    class Config:
        from_attributes = True
