from database import db
from datetime import datetime

class BookingModel(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.String(50), primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id', ondelete='CASCADE'), nullable=False)
    guest_name = db.Column(db.String(100), nullable=False)
    guest_phone = db.Column(db.String(20), nullable=False)
    guest_email = db.Column(db.String(100), nullable=False)
    check_in = db.Column(db.DateTime, nullable=False)
    check_out = db.Column(db.DateTime, nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    purpose = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='confirmed')  # 'confirmed', 'pending', 'cancelled', 'completed'
    booked_by = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Booking {self.id} (Room {self.room_id})>"
