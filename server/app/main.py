import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.exercise_controller import router as exercise_router
from app.controllers.exercise_log_controller import router as exercise_log_router
from app.controllers.food_consumption_controller import (
    router as food_consumption_router,
)
from app.controllers.food_controller import router as food_router
from app.controllers.meal_controller import router as meal_router
from app.controllers.report_controller import router as report_router
from app.controllers.user_controller import router as user_router
from app.controllers.water_intake_controller import router as water_intake_router
from app.utils import populate_database

load_dotenv()

app = FastAPI(title="NutriTrack Server", version="2.0.0")

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

app.include_router(exercise_router)
app.include_router(exercise_log_router)
app.include_router(food_router)
app.include_router(food_consumption_router)
app.include_router(meal_router)
app.include_router(report_router)
app.include_router(user_router)
app.include_router(water_intake_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.on_event("startup")
async def startup_event():
    if os.getenv("NUTRITRACK_POPULATE_DATABASE", "").lower() in ("true", "1"):
        populate_database()
