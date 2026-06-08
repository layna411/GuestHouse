import sys
import os
from datetime import datetime

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from app import create_app
from database import db
from viewmodels.booking_viewmodel import BookingViewModel
from models.room import RoomModel

app = create_app()
with app.app_context():
    # Let's find a room
    room = RoomModel.query.first()
    if not room:
        print("No rooms found!")
        sys.exit(1)
        
    payload = {
        "roomId": str(room.id),
        "guestName": "Test Guest",
        "guestPhone": "+91 99999 88888",
        "guestEmail": "test.guest@email.com",
        "checkIn": "2026-06-20T14:00:00.000Z",
        "checkOut": "2026-06-22T11:00:00.000Z",
        "numberOfGuests": 2,
        "purpose": "Testing notifications",
        "bookedBy": None,
        "status": "pending",
        "mealPlan": "Room with Breakfast",
        "pricePerNight": 2500,
        "totalPrice": 5250
    }
    
    try:
        res = BookingViewModel.create_booking(payload)
        print("Success! Created booking:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()
