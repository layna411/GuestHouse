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
from models.notification import NotificationModel
from models.room_availability import RoomAvailabilityModel
from models.gallery import GalleryModel
from models.review import ReviewModel

def bootstrap_database():
    """Connects to XAMPP MySQL server directly and creates database if missing."""
    if getattr(Config, "IS_SQLITE", False):
        print("Using local SQLite file. Skipping MySQL server communication check.")
        return
        
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

        # 1. Seed Users (Admin & Staff)
        if UserModel.query.count() == 0:
            print("Seeding users...")
            admin = UserModel(
                id="admin001",
                name="Admin User",
                email="admin@simats.edu",
                role="admin",
                department="Administration",
                phone="+91 98765 00000",
                is_active=True
            )
            admin.set_password("password123")

            cust1 = UserModel(
                id="cust001",
                name="Priya Menon",
                email="priya.menon@simats.edu",
                role="staff",
                department="Front Desk",
                phone="+91 98765 11111",
                is_active=True
            )
            cust1.set_password("password123")

            cust2 = UserModel(
                id="cust002",
                name="Arjun Reddy",
                email="arjun.reddy@simats.edu",
                role="staff",
                department="Housekeeping",
                phone="+91 98765 22222",
                is_active=True
            )
            cust2.set_password("password123")

            db.session.add_all([admin, cust1, cust2])
            db.session.commit()
            print("Users seeded.")
        else:
            print("Users table already populated.")

        # 2. Seed Rooms (12 Deluxe Rooms, 6 Super Deluxe Rooms)
        if RoomModel.query.count() == 0:
            print("Seeding rooms...")
            rooms_to_seed = []
            
            # 12 Deluxe Rooms (101 to 112)
            deluxe_images = [
                "/images/deluxe_room.jpeg",
                "/images/lobby_view.jpeg",
                "/images/dining_hall.jpeg",
                "/images/bed_detail.jpeg",
                "/images/room_suite.jpeg",
                "/images/facade.jpeg",
                "/images/bathroom.jpeg"
            ]
            for i in range(1, 13):
                room_number = f"1{str(i).zfill(2)}"
                img = deluxe_images[(i - 1) % len(deluxe_images)]
                rooms_to_seed.append({
                    "room_number": room_number,
                    "floor": 1,
                    "type": "Deluxe Room",
                    "capacity": 3,
                    "price": 2250.0,
                    "status": "vacant" if i != 2 else "booked",
                    "amenities": ["50 inch smart TV", "cupboard", "Air conditioned", "twin bed"],
                    "image_url": img
                })

            # 6 Super Deluxe Rooms (G01 to G06)
            super_images = [
                "/images/super_deluxe_room.jpeg",
                "/images/deluxe_room.jpeg",
                "/images/exterior_night.jpeg",
                "/images/room_corner.jpeg",
                "/images/conference_room.jpeg",
                "/images/lobby_entrance.jpeg",
                "/images/gym.jpeg"
            ]
            for i in range(1, 7):
                room_number = f"G0{i}"
                img = super_images[(i - 1) % len(super_images)]
                rooms_to_seed.append({
                    "room_number": room_number,
                    "floor": 0,
                    "type": "Super Deluxe Room",
                    "capacity": 3,
                    "price": 2350.0,
                    "status": "vacant" if i != 2 else "booked",
                    "amenities": ["50 inch smart TV", "cupboard", "Air conditioned", "mini fridge", "2 seater sofa", "ceiling fan"],
                    "image_url": img
                })

            rooms = []
            for r_data in rooms_to_seed:
                r = RoomModel(
                    room_number=r_data["room_number"],
                    floor=r_data["floor"],
                    type=r_data["type"],
                    capacity=r_data["capacity"],
                    price=r_data["price"],
                    status=r_data["status"],
                    image_url="/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg" if "super" in r_data["type"].lower() else "/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg"
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
            room_g02 = RoomModel.query.filter_by(room_number="G02").first()

            if room_102 and room_g02:
                b1 = BookingModel(
                    id="B001",
                    room_id=room_102.id,
                    guest_name="Dr. Rajesh Kumar",
                    guest_phone="+91 98765 43210",
                    guest_email="rajesh.kumar@email.com",
                    check_in=datetime(2026, 6, 20, 14, 0),
                    check_out=datetime(2026, 6, 22, 11, 0),
                    number_of_guests=2,
                    purpose="Conference Speaker",
                    status="confirmed",
                    booked_by="cust001",
                    meal_plan="Room with Breakfast",
                    price_per_night=2600.00,
                    total_price=5460.00, # 2 nights * 2600 + 5% tax
                    created_at=datetime(2026, 6, 5)
                )

                b2 = BookingModel(
                    id="B002",
                    room_id=room_g02.id,
                    guest_name="Prof. Anita Sharma",
                    guest_phone="+91 98765 43211",
                    guest_email="anita.sharma@email.com",
                    check_in=datetime(2026, 6, 19, 12, 0),
                    check_out=datetime(2026, 6, 21, 10, 0),
                    number_of_guests=1,
                    purpose="Guest Lecture",
                    status="confirmed",
                    booked_by="cust002",
                    meal_plan="Room without Breakfast",
                    price_per_night=2350.00,
                    total_price=4935.00, # 2 nights * 2350 + 5% tax
                    created_at=datetime(2026, 6, 2)
                )

                db.session.add_all([b1, b2])
                db.session.commit()
                print("Bookings seeded.")
            else:
                print("WARNING: Could not find rooms 102 and G02. Skipping booking seed.")
        else:
            print("Bookings table already populated.")

        # 4. Seed Gallery Table
        if GalleryModel.query.count() == 0:
            print("Seeding gallery...")
            default_gallery = [
                '/images/lobby_entrance.jpeg',
                '/images/premium_lounge.jpeg',
                '/images/facade.jpeg',
                '/images/exterior_night.jpeg',
                '/images/swimming_pool.jpeg',
                '/images/lobby_view.jpeg',
                '/images/dining_hall.jpeg',
                '/images/room_suite.jpeg',
                '/images/bed_detail.jpeg',
                '/images/bathroom.jpeg',
                '/images/deluxe_room.jpeg',
                '/images/room_corner.jpeg',
                '/images/conference_room.jpeg',
                '/images/gym.jpeg',
                '/images/super_deluxe_room.jpeg',
                '/images/lounge_sitting.jpeg',
                '/images/suite_balcony.jpeg'
            ]
            for img in default_gallery:
                g = GalleryModel(image_url=img, caption="Saveetha Showcase Photo")
                db.session.add(g)
            db.session.commit()
            print("Gallery seeded.")
        else:
            print("Gallery table already populated.")

        # 5. Seed RoomAvailability (Excel override matching)
        if RoomAvailabilityModel.query.count() == 0:
            print("Seeding room availabilityOverrides...")
            
            # Seed only blocked/unavailable dates (capacity 0) as overrides
            # All other dates will default to 12 for Deluxe and 6 for Super Deluxe
            excel_data = {
                "Deluxe Room": {
                    "2026-06-16": 0, "2026-06-17": 0
                },
                "Super Deluxe Room": {
                    "2026-06-16": 0, "2026-06-17": 0
                }
            }
            for room_type, dates in excel_data.items():
                for date_str, count in dates.items():
                    ra = RoomAvailabilityModel(room_type=room_type, date=date_str, available_count=count)
                    db.session.add(ra)
            db.session.commit()
            print("Room availabilities seeded.")
        else:
            print("Room availabilities table already populated.")

        # 6. Seed Reviews
        if ReviewModel.query.count() == 0:
            print("Seeding reviews...")
            reviews_data = [
                {
                    "reviewer_name": "Ayadural",
                    "reviewer_email": "ayadural@email.com",
                    "reviewer_country": "🇸🇬",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "Peaceful",
                    "date_str": "4 June 2026"
                },
                {
                    "reviewer_name": "Vicent",
                    "reviewer_email": "vicent@email.com",
                    "reviewer_country": "🇲🇾",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "Good",
                    "date_str": "2 June 2026"
                },
                {
                    "reviewer_name": "Dr. James Anderson",
                    "reviewer_email": "james.anderson@email.com",
                    "reviewer_country": "🇬🇧",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "The hospitality of the guest house staff was incredible. The environment is perfect for academic work with completely silent zones and fast Wi-Fi. (Disadvantages: Breakfast options could be slightly more diverse.)",
                    "date_str": "28 May 2026"
                },
                {
                    "reviewer_name": "Sarah Jenkins",
                    "reviewer_email": "sarah.jenkins@email.com",
                    "reviewer_country": "🇺🇸",
                    "rating": 9,
                    "rating_text": "Wonderful",
                    "comments": "Very close to Saveetha Dental College, which was ideal for my conference. Clean rooms and helpful concierge desk. (Disadvantages: The water pressure was a bit low on the third floor during peak hours.)",
                    "date_str": "25 May 2026"
                },
                {
                    "reviewer_name": "Prof. Ramachandran",
                    "reviewer_email": "ramachandran@email.com",
                    "reviewer_country": "🇮🇳",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "Excellent campus residency! Having dynamic meal plan rates and check-in without registration hassle was a breeze.",
                    "date_str": "22 May 2026"
                },
                {
                    "reviewer_name": "Hiroshi Tanaka",
                    "reviewer_email": "hiroshi.tanaka@email.com",
                    "reviewer_country": "🇯🇵",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "The stay was absolutely spectacular. The rooms have a premium aesthetic and excellent workspaces.",
                    "date_str": "20 May 2026"
                },
                {
                    "reviewer_name": "Prof. Anita Sharma",
                    "reviewer_email": "anita.sharma@email.com",
                    "reviewer_country": "🇮🇳",
                    "rating": 10,
                    "rating_text": "Exceptional",
                    "comments": "Clean, quiet, and fully equipped workspaces. Exceeded expectations.",
                    "date_str": "19 May 2026"
                }
            ]
            for r_data in reviews_data:
                r = ReviewModel(
                    reviewer_name=r_data["reviewer_name"],
                    reviewer_email=r_data["reviewer_email"],
                    reviewer_country=r_data["reviewer_country"],
                    rating=r_data["rating"],
                    rating_text=r_data["rating_text"],
                    comments=r_data["comments"],
                    date_str=r_data["date_str"]
                )
                db.session.add(r)
            db.session.commit()
            print("Reviews seeded.")
        else:
            print("Reviews table already populated.")

        print("Initialization and seeding complete.")

if __name__ == "__main__":
    print("="*60)
    print("GUEST HOUSE DB SCHEMA & SEED UTILITY")
    print("="*60)
    try:
        bootstrap_database()
        seed_all_tables(reset=True)
        print("="*60)
        print("Database successfully configured!")
        print("You can now run app.py to start the GuestHouse server.")
        print("="*60)
    except Exception as e:
        print("\nFATAL ERROR during setup. See messages above.")
        sys.exit(1)
