from database import db
from models.room import RoomModel

class RoomViewModel:
    @staticmethod
    def to_dict(room):
        """Maps a RoomModel schema to the exact field naming expected by the frontend UI."""
        if not room:
            return None
        return {
            "id": str(room.id),
            "roomNumber": room.room_number,
            "floor": room.floor,
            "type": room.type,
            "capacity": room.capacity,
            "price": float(room.price),
            "status": room.status,
            "amenities": room.amenities,
            "imageUrl": room.image_url or ""
        }

    @classmethod
    def get_all_rooms(cls):
        """Retrieves and formats all room entries."""
        rooms = RoomModel.query.all()
        return [cls.to_dict(r) for r in rooms]

    @classmethod
    def create_room(cls, data):
        """Creates a new room in the database after validating fields."""
        room_number = data.get("roomNumber")
        floor = data.get("floor")
        room_type = data.get("type")
        capacity = data.get("capacity")
        price = data.get("price")
        amenities = data.get("amenities", [])
        image_url = data.get("imageUrl", "")

        if not room_number or floor is None or not room_type or capacity is None or price is None:
            raise ValueError("Room number, floor, type, capacity, and price are required.")

        # Check unique room number
        existing = RoomModel.query.filter_by(room_number=room_number).first()
        if existing:
            raise ValueError(f"Room number {room_number} already exists.")

        room = RoomModel(
            room_number=room_number,
            floor=int(floor),
            type=room_type,
            capacity=int(capacity),
            price=float(price),
            status=data.get("status", "vacant"),
            image_url=image_url
        )
        room.amenities = amenities  # Uses setter properties
        
        db.session.add(room)
        db.session.commit()
        return cls.to_dict(room)

    @classmethod
    def update_room(cls, room_id, data):
        """Updates properties of a specific room."""
        room = RoomModel.query.get(int(room_id))
        if not room:
            raise ValueError("Room not found.")

        if "roomNumber" in data and data["roomNumber"]:
            if data["roomNumber"] != room.room_number:
                # Check uniqueness
                existing = RoomModel.query.filter_by(room_number=data["roomNumber"]).first()
                if existing:
                    raise ValueError(f"Room number {data['roomNumber']} already exists.")
                room.room_number = data["roomNumber"]

        if "floor" in data:
            room.floor = int(data["floor"])
            
        if "type" in data:
            room.type = data["type"]
            
        if "capacity" in data:
            room.capacity = int(data["capacity"])
            
        if "price" in data:
            room.price = float(data["price"])
            
        if "status" in data:
            room.status = data["status"]
            
        if "amenities" in data:
            room.amenities = data["amenities"]
            
        if "imageUrl" in data:
            room.image_url = data["imageUrl"]

        db.session.commit()
        return cls.to_dict(room)

    @classmethod
    def delete_room(cls, room_id):
        """Removes a room from the system."""
        room = RoomModel.query.get(int(room_id))
        if not room:
            raise ValueError("Room not found.")

        db.session.delete(room)
        db.session.commit()
        return True
