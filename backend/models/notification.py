from database import db
from datetime import datetime

class NotificationModel(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.String(50), db.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    # Backref for the related booking
    booking = db.relationship('BookingModel', backref='notifications', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "bookingId": self.booking_id,
            "message": self.message,
            "isRead": self.is_read,
            "createdAt": self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<Notification {self.id} for Booking {self.booking_id}>"
