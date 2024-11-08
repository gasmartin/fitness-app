import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.user_controller import router as user_router
from app.controllers.food_controller import router as food_router
from app.controllers.utility_controller import router as utility_router
from app.utils import populate_database

app = FastAPI(title="NutriTrack Server", version="1.0.0")

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

app.include_router(user_router)
app.include_router(food_router)
app.include_router(utility_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.on_event("startup")
async def startup_event():
    if os.getenv("NUTRITRACK_POPULATE_DATABASE"):
        populate_database()
