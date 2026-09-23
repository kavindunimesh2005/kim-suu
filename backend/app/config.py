"""Application configuration module."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env if it exists
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Config:
    """Base configuration class."""
    BASE_DIR = backend_dir
    DATA_FOLDER = backend_dir / "data"
    UPLOAD_FOLDER = backend_dir / "uploads"
    
    # Secrets
    SECRET_KEY = os.getenv("SECRET_KEY", "default-insecure-flask-secret-key-change-in-prod")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-insecure-jwt-secret-key-change-in-prod")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    
    # Upload limits & extensions
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(5 * 1024 * 1024)))  # 5 MB
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
    ALLOWED_UPLOAD_CATEGORIES = {"books", "blogs", "stories", "gallery", "author"}
    
    # CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]
    if FRONTEND_URL not in CORS_ORIGINS:
        CORS_ORIGINS.append(FRONTEND_URL)
        
    # Server
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True
    # Test specific settings if needed


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig
}
