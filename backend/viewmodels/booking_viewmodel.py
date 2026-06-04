import re
from datetime import datetime
from database import db
from models.booking import BookingModel
from models.room import RoomModel

class BookingViewModel:
    @staticmethod
    def to_dict(booking):
        """Translates a BookingModel to the exact CamelCase structure the React UI expects."""
        if not booking:
            return None
        return {
            "id": booking.id,
            "roomId": str(booking.room_id),
            "guestName": booking.guest_name,
            "guestPhone": booking.guest_phone,
            "guestEmail": booking.guest_email,
            "checkIn": booking.check_in.isoformat(),
            "checkOut": booking.check_out.isoformat(),
            "numberOfGuests": booking.number_of_guests,
            "purpose": booking.purpose,
            "status": booking.status,
            "bookedBy": booking.booked_by,
            "createdAt": booking.created_at.isoformat()
        }

    @classmethod
    def get_all_bookings(cls):
        """Retrieves all reservations."""
        bookings = BookingModel.query.order_by(BookingModel.created_at.desc()).all()
        return [cls.to_dict(b) for b in bookings]

    @classmethod
    def get_employee_bookings(cls, employee_id):
        """Retrieves reservations placed by a specific employee."""
        bookings = BookingModel.query.filter_by(booked_by=employee_id).order_by(BookingModel.created_at.desc()).all()
        return [cls.to_dict(b) for b in bookings]

    @classmethod
    def _generate_booking_id(cls):
        """Helper to generate ID like B001, B002 etc by incrementing the highest existing numerical ID."""
        bookings = BookingModel.query.all()
        max_num = 0
        for b in bookings:
            match = re.match(r"B(\d+)", b.id)
            if match:
                num = int(match.group(1))
                if num > max_num:
                    max_num = num
        return f"B{str(max_num + 1).zfill(3)}"

    @classmethod
    def create_booking(cls, data):
        """Registers a new guest room reservation with complete validation checks."""
        room_id_str = data.get("roomId")
        guest_name = data.get("guestName")
        guest_phone = data.get("guestPhone")
        guest_email = data.get("guestEmail")
        check_in_str = data.get("checkIn")
        check_out_str = data.get("checkOut")
        number_of_guests = data.get("numberOfGuests")
        purpose = data.get("purpose", "")
        booked_by = data.get("bookedBy", "demo")

        if not room_id_str or not guest_name or not guest_phone or not guest_email or not check_in_str or not check_out_str or number_of_guests is None:
            raise ValueError("Room ID, guest name, contact info, and check-in/out dates are required.")

        # Check room exists
        room_id = int(room_id_str)
        room = RoomModel.query.get(room_id)
        if not room:
            raise ValueError("Selected room does not exist.")
            
        if room.status == "maintenance":
            raise ValueError("This room is currently under maintenance and cannot be booked.")

        # Parse Datetime strings (expects ISO format e.g. "2026-05-20T14:00" or datetime objects)
        try:
            if isinstance(check_in_str, str):
                # Clean up ISO strings with time zones or trailing Z if present
                clean_in = check_in_str.replace("Z", "").split(".")[0]
                check_in = datetime.fromisoformat(clean_in)
            else:
                check_in = check_in_str

            if isinstance(check_out_str, str):
                clean_out = check_out_str.replace("Z", "").split(".")[0]
                check_out = datetime.fromisoformat(clean_out)
            else:
                check_out = check_out_str
        except Exception:
            raise ValueError("Invalid check-in or check-out date format. Use ISO format (YYYY-MM-DDTHH:MM).")

        if check_in >= check_out:
            raise ValueError("Check-in date/time must be strictly before check-out date/time.")

        # Date conflict verification:
        # A conflict occurs if there is another confirmed booking for the same room where:
        # other.check_in < check_out AND other.check_out > check_in
        conflicting_booking = BookingModel.query.filter(
            BookingModel.room_id == room_id,
            BookingModel.status == "confirmed",
            BookingModel.check_in < check_out,
            BookingModel.check_out > check_in
        ).first()

        if conflicting_booking:
            raise ValueError(
                f"Booking conflict: Room {room.room_number} is already reserved "
                f"between {conflicting_booking.check_in.strftime('%Y-%m-%d %H:%M')} "
                f"and {conflicting_booking.check_out.strftime('%Y-%m-%d %H:%M')}."
            )

        # Create reservation
        booking_id = cls._generate_booking_id()
        booking = BookingModel(
            id=booking_id,
            room_id=room_id,
            guest_name=guest_name,
            guest_phone=guest_phone,
            guest_email=guest_email,
            check_in=check_in,
            check_out=check_out,
            number_of_guests=int(number_of_guests),
            purpose=purpose,
            status="confirmed",
            booked_by=booked_by
        )
        
        # Automatically update room status to booked
        room.status = "booked"

        db.session.add(booking)
        db.session.commit()
        return cls.to_dict(booking)

    @classmethod
    def cancel_booking(cls, booking_id):
        """Cancels an existing booking and sets the room back to vacant if no other concurrent stays exist."""
        booking = BookingModel.query.get(booking_id)
        if not booking:
            raise ValueError("Reservation not found.")

        booking.status = "cancelled"
        
        # Check if the room needs to be set back to vacant
        # It should be set to vacant if no other confirmed bookings overlap current date
        room = RoomModel.query.get(booking.room_id)
        if room:
            now = datetime.now()
            still_has_booking = BookingModel.query.filter(
                BookingModel.room_id == room.id,
                BookingModel.status == "confirmed",
                BookingModel.check_in <= now,
                BookingModel.check_out >= now
            ).first()
            if not still_has_booking:
                room.status = "vacant"

        db.session.commit()
        return cls.to_dict(booking)

    @classmethod
    def complete_booking(cls, booking_id):
        """Completes an active booking and vacates the room."""
        booking = BookingModel.query.get(booking_id)
        if not booking:
            raise ValueError("Reservation not found.")

        booking.status = "completed"
        
        # Mark room as vacant
        room = RoomModel.query.get(booking.room_id)
        if room:
            now = datetime.now()
            still_has_booking = BookingModel.query.filter(
                BookingModel.room_id == room.id,
                BookingModel.status == "confirmed",
                BookingModel.check_in <= now,
                BookingModel.check_out >= now
            ).first()
            if not still_has_booking:
                room.status = "vacant"

        db.session.commit()
        return cls.to_dict(booking)
