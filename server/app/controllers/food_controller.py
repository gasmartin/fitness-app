import os
from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import get_current_user
from app.schemas import food as food_schema
from app.schemas import user as user_schema


router = APIRouter(
    prefix="/foods",
    tags=["foods"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[food_schema.FoodGraphQL])
async def get_foods(
    search_term: Optional[str] = Query(None, description="The search term used to filter foods"),
    # current_user: user_schema.User = Depends(get_current_user),
):
    try:
        if search_term is None:
            query = """
            query getAllFood {
                getAllFood {
                    id
                    name
                    nutrients {
                        kcal
                        carbohydrates
                        protein
                        lipids
                    }
                }
            }
            """

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    os.getenv("TACO_API_GRAPHQL_URL") + "/graphql",
                    json={"query": query},
                )

                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to fetch foods",
                    )

                foods = response.json()["data"]["getAllFood"]

                # Putting the nutrients outside
                for food in foods:
                    food["kcal"] = food["nutrients"].pop("kcal")
                    food["carbohydrates"] = food["nutrients"].pop("carbohydrates")
                    food["protein"] = food["nutrients"].pop("protein")
                    food["lipids"] = food["nutrients"].pop("lipids")
                    del food["nutrients"]
            
                return foods
        else:
            query = """
            query getFoodByName($name: String!) {
                getFoodByName(name: $name) {
                    id
                    name
                    nutrients {
                        kcal
                        carbohydrates
                        protein
                        lipids
                    }
                }
            }
            """

            variables = {"name": search_term}

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    os.getenv("TACO_API_GRAPHQL_URL") + "/graphql",
                    json={"query": query, "variables": variables},
                )

                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to fetch foods",
                    )

                foods = response.json()["data"]["getFoodByName"]

                # Putting the nutrients outside
                for food in foods:
                    food["kcal"] = food["nutrients"].pop("kcal")
                    food["carbohydrates"] = food["nutrients"].pop("carbohydrates")
                    food["protein"] = food["nutrients"].pop("protein")
                    food["lipids"] = food["nutrients"].pop("lipids")
                    del food["nutrients"]
            
                return foods
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch foods: " + str(e),
        )


@router.get("/{food_id}")
async def get_food(food_id: int):
    return {"food_id": food_id}
