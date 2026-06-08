import sys
import os
from datetime import datetime

# Add backend directory to system path to allow local imports
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from app import create_app
from utils.email import send_booking_pending_email

class DummyBooking:
    def __init__(self):
        self.id = "B999"
        self.guest_name = "Layna Test Guest"
        self.guest_email = "layna4115@gmail.com"
        self.guest_phone = "9876543210"
        self.check_in = datetime.now()
        self.check_out = datetime.now()
        self.number_of_guests = 2
        self.meal_plan = "Room with Breakfast"
        self.purpose = "Business Trip"
        self.status = "pending"

def test_smtp_delivery():
    app = create_app()
    with app.app_context():
        booking = DummyBooking()
        print("=== SMTP Email Delivery Test ===")
        print(f"SMTP Server:   {app.config.get('SMTP_SERVER')}")
        print(f"SMTP Port:     {app.config.get('SMTP_PORT')}")
        print(f"SMTP Username: {app.config.get('SMTP_USERNAME')}")
        print(f"Mail From:     {app.config.get('MAIL_FROM')}")
        print(f"Send To:       {booking.guest_email}")
        print("================================")
        
        result = send_booking_pending_email(booking)
        if result:
            print("\nRESULT: SUCCESS! The email was sent successfully via SMTP.")
        else:
            print("\nRESULT: FAILURE! The email could not be sent. Check logs/errors above.")

if __name__ == "__main__":
    test_smtp_delivery()
