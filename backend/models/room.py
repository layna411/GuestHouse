import json
from database import db

class RoomModel(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_number = db.Column(db.String(10), unique=True, nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'AC' or 'Non-AC'
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='vacant')  # 'vacant', 'booked', 'maintenance'
    _amenities = db.Column('amenities', db.Text, nullable=True)  # Stored as JSON string
    image_url = db.Column(db.String(255), nullable=True)

    # Relationships
    bookings = db.relationship('BookingModel', backref='room', lazy=True, cascade="all, delete-orphan")

    @property
    def amenities(self):
        if not self._amenities:
            return []
        try:
            return json.loads(self._amenities)
        except Exception:
            return []

    @amenities.setter
    def amenities(self, value):
        if value is None:
            self._amenities = "[]"
        else:
            self._amenities = json.dumps(value)

    def __repr__(self):
        return f"<Room {self.room_number} ({self.type})>"
