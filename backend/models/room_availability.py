from database import db

class RoomAvailabilityModel(db.Model):
    __tablename__ = 'room_availabilities'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    available_count = db.Column(db.Integer, nullable=False)

    __table_args__ = (db.UniqueConstraint('room_type', 'date', name='_room_type_date_uc'),)

    def to_dict(self):
        return {
            "id": self.id,
            "roomType": self.room_type,
            "date": self.date,
            "availableCount": self.available_count
        }

    def __repr__(self):
        return f"<RoomAvailability {self.room_type} on {self.date}: {self.available_count}>"
