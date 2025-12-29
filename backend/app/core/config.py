import os
from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Grifyn API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_CHANGE_THIS_IN_PROD"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "grifyn_db"

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5138", # Added current frontend port
        "http://127.0.0.1:5138",
        "http://127.0.0.1:5173"
    ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        case_sensitive = True

settings = Settings()