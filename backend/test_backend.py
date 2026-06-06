import unittest
import json
from datetime import datetime, timedelta
from app import create_app
from database import db
from models.user import UserModel
from models.room import RoomModel
from models.booking import BookingModel

class TestGuestHouseBackend(unittest.TestCase):
    def setUp(self):
        """Sets up an isolated, in-memory SQLite database environment for each test."""
        # Create a test Flask app configured to use an in-memory SQLite database
        class TestConfig:
            SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
            SQLALCHEMY_TRACK_MODIFICATIONS = False
            SECRET_KEY = "test_secret_key"
            TESTING = True

        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Build clean test tables
        db.create_all()
        self.seed_test_data()

    def tearDown(self):
        """Clean up and tear down the test environment."""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def seed_test_data(self):
        """Helper to seed basic test entities into the in-memory database."""
        # 1. Seed admin and employee users
        self.admin = UserModel(
            id="admin001",
            name="Admin User",
            email="admin@simats.edu",
            role="admin",
            department="Administration",
            phone="+91 98765 00000"
        )
        self.admin.set_password("password123")

        self.emp = UserModel(
            id="emp001",
            name="Priya Menon",
            email="priya.menon@simats.edu",
            role="staff",
            department="Guest Relations",
            phone="+91 98765 11111"
        )
        self.emp.set_password("password123")
 
        db.session.add_all([self.admin, self.emp])
        db.session.commit()

        # 2. Seed a test room
        self.room = RoomModel(
            room_number="101",
            floor=1,
            type="AC",
            capacity=2,
            price=1500.0,
            status="vacant"
        )
        self.room.amenities = ["WiFi", "TV"]
        db.session.add(self.room)
        db.session.commit()

        # 3. Seed an existing booking
        self.booking = BookingModel(
            id="B001",
            room_id=self.room.id,
            guest_name="Dr. Rajesh Kumar",
            guest_phone="+91 98765 43210",
            guest_email="rajesh.kumar@email.com",
            check_in=datetime.now() + timedelta(days=2),
            check_out=datetime.now() + timedelta(days=4),
            number_of_guests=2,
            purpose="Conference",
            status="confirmed",
            booked_by="emp001"
        )
        db.session.add(self.booking)
        db.session.commit()

    # --- Test Case 1: Authentication ---
    def test_login_success(self):
        """Test authentication with correct credentials."""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@simats.edu",
            "password": "password123",
            "role": "admin"
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("user", data)
        self.assertEqual(data["user"]["name"], "Admin User")

    def test_login_fail(self):
        """Test authentication failures with incorrect credentials."""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@simats.edu",
            "password": "wrong_password",
            "role": "admin"
        })
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn("error", data)

    # --- Test Case 2: Room API CRUD ---
    def test_get_rooms(self):
        """Test retrieving all rooms."""
        response = self.client.get("/api/rooms")
        self.assertEqual(response.status_code, 200)
        rooms = json.loads(response.data)
        self.assertEqual(len(rooms), 1)
        self.assertEqual(rooms[0]["roomNumber"], "101")
        self.assertIn("WiFi", rooms[0]["amenities"])

    def test_create_room(self):
        """Test registering a new room via the API."""
        response = self.client.post("/api/rooms", json={
            "roomNumber": "102",
            "floor": 1,
            "type": "AC",
            "capacity": 3,
            "price": 2000.0,
            "amenities": ["WiFi", "Mini Fridge"]
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["room"]["roomNumber"], "102")
        
        # Verify it was added to database
        db_room = RoomModel.query.filter_by(room_number="102").first()
        self.assertIsNotNone(db_room)
        self.assertEqual(db_room.capacity, 3)

    # --- Test Case 3: Bookings & Overlap Validation ---
    def test_create_booking_success(self):
        """Test successful booking placement on non-overlapping dates."""
        check_in = (datetime.now() + timedelta(days=5)).isoformat()
        check_out = (datetime.now() + timedelta(days=7)).isoformat()
        
        response = self.client.post("/api/bookings", json={
            "roomId": str(self.room.id),
            "guestName": "Dr. Priya Das",
            "guestPhone": "+91 98765 77777",
            "guestEmail": "priya.das@email.com",
            "checkIn": check_in,
            "checkOut": check_out,
            "numberOfGuests": 2,
            "purpose": "Lecture",
            "bookedBy": "emp001"
        })
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["booking"]["guestName"], "Dr. Priya Das")

    def test_create_booking_overlap_conflict(self):
        """Test overlap conflict validation: booking the same room on concurrent dates should fail."""
        # Booking B001 is booked for: (now + 2 days) to (now + 4 days)
        # We try to book for: (now + 3 days) to (now + 5 days) -> OVERLAP!
        check_in = (datetime.now() + timedelta(days=3)).isoformat()
        check_out = (datetime.now() + timedelta(days=5)).isoformat()
        
        response = self.client.post("/api/bookings", json={
            "roomId": str(self.room.id),
            "guestName": "Dr. Overlap Guest",
            "guestPhone": "+91 98765 99999",
            "guestEmail": "overlap@email.com",
            "checkIn": check_in,
            "checkOut": check_out,
            "numberOfGuests": 2,
            "purpose": "Conflict Test",
            "bookedBy": "emp001"
        })
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertIn("Booking conflict", data["error"])

    def test_cancel_booking(self):
        """Test cancelling a booking."""
        response = self.client.post(f"/api/bookings/{self.booking.id}/cancel")
        self.assertEqual(response.status_code, 200)
        
        # Verify status in database
        db_booking = BookingModel.query.get(self.booking.id)
        self.assertEqual(db_booking.status, "cancelled")

    # --- Test Case 4: Customer CRUD ---
    def test_get_customers(self):
        """Test customer fetching list."""
        response = self.client.get("/api/customers")
        self.assertEqual(response.status_code, 200)
        customers = json.loads(response.data)
        self.assertEqual(len(customers), 1)
        self.assertEqual(customers[0]["name"], "Priya Menon")

    def test_add_customer(self):
        """Test registering a new staff member."""
        response = self.client.post("/api/customers", json={
            "name": "Karan Johar",
            "email": "karan@simats.edu",
            "department": "Housekeeping",
            "phone": "+91 98765 98765"
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["customer"]["name"], "Karan Johar")
        
        # Verify in database
        db_user = UserModel.query.filter_by(email="karan@simats.edu").first()
        self.assertIsNotNone(db_user)
        self.assertEqual(db_user.role, "staff")

    def test_confirm_booking_conflict(self):
        """Test confirming a pending booking on a room that has an overlapping confirmed booking fails."""
        # Create a pending booking for overlapping dates
        from models.booking import BookingModel
        pending_b = BookingModel(
            id="B002",
            room_id=self.room.id,
            guest_name="Pending Guest",
            guest_phone="+91 98765 00002",
            guest_email="pending@email.com",
            check_in=self.booking.check_in,
            check_out=self.booking.check_out,
            number_of_guests=1,
            purpose="Test pending",
            status="pending",
            booked_by="emp001"
        )
        db.session.add(pending_b)
        db.session.commit()

        # Try to confirm this booking for same room via API
        response = self.client.post(f"/api/bookings/{pending_b.id}/confirm", json={
            "roomId": str(self.room.id)
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertIn("Booking conflict", data["error"])

if __name__ == "__main__":
    unittest.main()
