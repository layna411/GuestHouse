import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import socket

def check_mysql_running(host, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        s.connect((host, int(port)))
        s.close()
        return True
    except Exception:
        return False

class Config:
    # Default to local XAMPP MySQL setup (root user, empty password, localhost, GuestHouse database)
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "GuestHouse")

    # Configure exclusively for MySQL (XAMPP setup: root user, empty password, localhost, GuestHouse database)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", 
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    IS_SQLITE = False

    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "guesthouse_secret_key_12345")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t")
