from pathlib import Path

SECRET_KEY = "WQcfyGkFjlf77HwKfNY5aGhUaJMxChO2N9o6Vvh2byM="
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_IN_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
ENCODING = "utf-8"

DEFAULT_MEALS = [
    {
        "name": "Café da Manhã",
        "default_time": "07:00",
    },
    {
        "name": "Almoço",
        "default_time": "11:00",
    },
    {
        "name": "Lanche da Tarde",
        "default_time": "15:00",
    },
    {
        "name": "Jantar",
        "default_time": "19:00",
    }
]

DEFAULT_EXERCISES = [
    {
        "name": "Caminhada (moderada, 5 km/h)",
        "calories_per_hour": 250,
    },
        {
        "name": "Corrida (moderada, 8 km/h)",
        "calories_per_hour": 600,
    },
        {
        "name": "Ciclismo (leve, 16-19 km/h)",
        "calories_per_hour": 400,
    },
        {
        "name": "Ciclismo (moderado, 20-23 km/h)",
        "calories_per_hour": 600,
    },
        {
        "name": "Natação (moderada)",
        "calories_per_hour": 500,
    },
        {
        "name": "Yoga",
        "calories_per_hour": 200,
    },
        {
        "name": "Dança (moderada)",
        "calories_per_hour": 300,
    },
        {
        "name": "Musculação (moderada)",
        "calories_per_hour": 250,
    },
        {
        "name": "Pular corda",
        "calories_per_hour": 700,
    },
        {
        "name": "Subir escadas",
        "calories_per_hour": 500,
    },
        {
        "name": "Treinamento funcional (HIIT)",
        "calories_per_hour": 700,
    },
        {
        "name": "Aeróbica (intensidade moderada)",
        "calories_per_hour": 400,
    },
        {
        "name": "Remo (moderado)",
        "calories_per_hour": 500,
    },
        {
        "name": "Boxe ou artes marciais (treinamento)",
        "calories_per_hour": 600,
    },
]

POPULATE_DB_JSON_FILE_PATH = Path(__file__).parent / "resources" / "foods.json"
