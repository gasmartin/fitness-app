from pathlib import Path

SECRET_KEY = "WQcfyGkFjlf77HwKfNY5aGhUaJMxChO2N9o6Vvh2byM="
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_IN_MINUTES = 30

POPULATE_DB_JSON_FILE_PATH = Path(__file__).parent / "resources" / "foods.json"
