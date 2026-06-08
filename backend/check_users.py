import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from app import create_app
from models.user import UserModel

app = create_app()
with app.app_context():
    print("--- USERS ---")
    users = UserModel.query.all()
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}")
