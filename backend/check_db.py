import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from app import create_app
from database import db
from models.booking import BookingModel
from models.notification import NotificationModel

app = create_app()
with app.app_context():
    print("--- BOOKINGS ---")
    bookings = BookingModel.query.all()
    for b in bookings:
        print(f"ID: {b.id}, Guest: {b.guest_name}, Status: {b.status}, Room ID: {b.room_id}")

    print("\n--- NOTIFICATIONS ---")
    notifs = NotificationModel.query.all()
    for n in notifs:
        print(f"ID: {n.id}, Booking ID: {n.booking_id}, Msg: {n.message}, IsRead: {n.is_read}")
