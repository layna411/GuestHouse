import sys
import os
import json
import pymysql
from datetime import datetime

# Adjust Python path to allow imports from backend root when running as script
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from flask import Flask
from config import Config
from database import db
from models.user import UserModel
from models.room import RoomModel
from models.booking import BookingModel

def bootstrap_database():
    """Connects to XAMPP MySQL server directly and creates database if missing."""
    print("Connecting directly to MySQL server to check/create GuestHouse database...")
    
    # Establish connection to MySQL server using raw PyMySQL (without specifying DB)
    connection = None
    try:
        connection = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            port=int(Config.DB_PORT)
        )
        with connection.cursor() as cursor:
            # Create database GuestHouse if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"Database '{Config.DB_NAME}' checked/created successfully.")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to communicate with local MySQL server: {e}")
        print("Please check that:")
        print("1. XAMPP Control Panel is open.")
        print("2. The MySQL module is started (running on port 3306).")
        print("3. Your MySQL root user credentials match database.py configurations.")
        raise e
    finally:
        if connection:
            connection.close()

def seed_all_tables(reset=False):
    """Initializes tables and seeds them with high fidelity GuestHouse mock data."""
    # Build a temporary standalone flask app context to run seeder
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        if reset:
            print("Reset flag is active. Wiping database tables...")
            db.drop_all()
            print("Wiped database successfully.")

        # Create all tables defined in models
        db.create_all()
        print("Database tables validated/created successfully.")

        # 1. Seed Users (Admin & Employees)
        if UserModel.query.count() == 0:
            print("Seeding users...")
            admin = UserModel(
                id="admin001",
                name="Admin User",
                email="admin@simats.edu",
                role="admin",
                department="Administration",
                phone="+91 98765 00000"
            )
            admin.set_password("password123")

            emp1 = UserModel(
                id="emp001",
                name="Priya Menon",
                email="priya.menon@simats.edu",
                role="employee",
                department="Guest Relations",
                phone="+91 98765 11111"
            )
            emp1.set_password("password123")

            emp2 = UserModel(
                id="emp002",
                name="Arjun Reddy",
                email="arjun.reddy@simats.edu",
                role="employee",
                department="Front Desk",
                phone="+91 98765 22222"
            )
            emp2.set_password("password123")

            db.session.add_all([admin, emp1, emp2])
            db.session.commit()
            print("Users seeded.")
        else:
            print("Users table already populated.")

        # 2. Seed Rooms
        if RoomModel.query.count() == 0:
            print("Seeding rooms...")
            rooms_to_seed = [
                {
                    "room_number": "101",
                    "floor": 1,
                    "type": "AC",
                    "capacity": 2,
                    "price": 1500.0,
                    "status": "vacant",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water"]
                },
                {
                    "room_number": "102",
                    "floor": 1,
                    "type": "AC",
                    "capacity": 3,
                    "price": 2000.0,
                    "status": "booked",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water", "Mini Fridge"]
                },
                {
                    "room_number": "103",
                    "floor": 1,
                    "type": "Non-AC",
                    "capacity": 2,
                    "price": 1000.0,
                    "status": "vacant",
                    "amenities": ["WiFi", "Bathroom"]
                },
                {
                    "room_number": "201",
                    "floor": 2,
                    "type": "AC",
                    "capacity": 4,
                    "price": 2500.0,
                    "status": "vacant",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water", "Mini Fridge", "Work Desk"]
                },
                {
                    "room_number": "202",
                    "floor": 2,
                    "type": "AC",
                    "capacity": 2,
                    "price": 1500.0,
                    "status": "booked",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water"]
                },
                {
                    "room_number": "203",
                    "floor": 2,
                    "type": "Non-AC",
                    "capacity": 3,
                    "price": 1200.0,
                    "status": "vacant",
                    "amenities": ["WiFi", "Bathroom", "Fan"]
                },
                {
                    "room_number": "301",
                    "floor": 3,
                    "type": "AC",
                    "capacity": 2,
                    "price": 1800.0,
                    "status": "vacant",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water", "Balcony"]
                },
                {
                    "room_number": "302",
                    "floor": 3,
                    "type": "AC",
                    "capacity": 3,
                    "price": 2200.0,
                    "status": "maintenance",
                    "amenities": ["WiFi", "TV", "Bathroom", "Hot Water", "Mini Fridge"]
                }
            ]

            rooms = []
            for r_data in rooms_to_seed:
                r = RoomModel(
                    room_number=r_data["room_number"],
                    floor=r_data["floor"],
                    type=r_data["type"],
                    capacity=r_data["capacity"],
                    price=r_data["price"],
                    status=r_data["status"]
                )
                r.amenities = r_data["amenities"]  # Setter parses JSON list
                rooms.append(r)

            db.session.add_all(rooms)
            db.session.commit()
            print("Rooms seeded.")
        else:
            print("Rooms table already populated.")

        # 3. Seed Bookings
        if BookingModel.query.count() == 0:
            print("Seeding bookings...")
            # Query rooms to map IDs correctly
            room_102 = RoomModel.query.filter_by(room_number="102").first()
            room_202 = RoomModel.query.filter_by(room_number="202").first()

            if room_102 and room_202:
                b1 = BookingModel(
                    id="B001",
                    room_id=room_102.id,
                    guest_name="Dr. Rajesh Kumar",
                    guest_phone="+91 98765 43210",
                    guest_email="rajesh.kumar@email.com",
                    check_in=datetime(2026, 5, 20, 14, 0),
                    check_out=datetime(2026, 5, 22, 11, 0),
                    number_of_guests=2,
                    purpose="Conference Speaker",
                    status="confirmed",
                    booked_by="emp001",
                    created_at=datetime(2026, 5, 15)
                )

                b2 = BookingModel(
                    id="B002",
                    room_id=room_202.id,
                    guest_name="Prof. Anita Sharma",
                    guest_phone="+91 98765 43211",
                    guest_email="anita.sharma@email.com",
                    check_in=datetime(2026, 5, 19, 12, 0),
                    check_out=datetime(2026, 5, 21, 10, 0),
                    number_of_guests=1,
                    purpose="Guest Lecture",
                    status="confirmed",
                    booked_by="emp002",
                    created_at=datetime(2026, 5, 12)
                )

                db.session.add_all([b1, b2])
                db.session.commit()
                print("Bookings seeded.")
            else:
                print("WARNING: Could not find rooms 102 and 202. Skipping booking seed.")
        else:
            print("Bookings table already populated.")
            
        print("Initialization and seeding complete.")

if __name__ == "__main__":
    print("="*60)
    print("GUEST HOUSE DB SCHEMA & SEED UTILITY")
    print("="*60)
    try:
        bootstrap_database()
        seed_all_tables()
        print("="*60)
        print("Database successfully configured!")
        print("You can now run app.py to start the GuestHouse server.")
        print("="*60)
    except Exception as e:
        print("\nFATAL ERROR during setup. See messages above.")
        sys.exit(1)
