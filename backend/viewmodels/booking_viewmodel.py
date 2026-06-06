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
            "paymentType": booking.payment_type or "Direct",
            "createdAt": booking.created_at.isoformat(),
            "mealPlan": booking.meal_plan or "Room without Breakfast",
            "pricePerNight": float(booking.price_per_night) if booking.price_per_night is not None else 0,
            "totalPrice": float(booking.total_price) if booking.total_price is not None else 0
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
        meal_plan = data.get("mealPlan", "Room without Breakfast")
        price_per_night = data.get("pricePerNight")
        total_price = data.get("totalPrice")
        payment_type = data.get("paymentType", "Direct")

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

        # Daily calendar availability verification (to avoid overflowing of bookings)
        from datetime import timedelta
        from models.room_availability import RoomAvailabilityModel
        cin_date = check_in.date()
        cout_date = check_out.date()
        nights = (cout_date - cin_date).days
        
        def get_default_capacity(room_type):
            if "super" in room_type.lower():
                return 6
            return 12

        rooms_of_type = RoomModel.query.filter_by(type=room.type).all()
        room_ids = [r.id for r in rooms_of_type]

        for n in range(nights):
            current_date = cin_date + timedelta(days=n)
            date_str = current_date.strftime("%Y-%m-%d")
            dt = datetime.combine(current_date, datetime.min.time())
            next_day_start = dt + timedelta(days=1)

            override = RoomAvailabilityModel.query.filter_by(room_type=room.type, date=date_str).first()
            cap = override.available_count if override else get_default_capacity(room.type)

            occupied = 0
            if room_ids:
                occupied = BookingModel.query.filter(
                    BookingModel.room_id.in_(room_ids),
                    BookingModel.status.in_(["confirmed", "pending"]),
                    BookingModel.check_in < next_day_start,
                    BookingModel.check_out >= next_day_start
                ).count()

            if cap - occupied <= 0:
                raise ValueError(f"Daily capacity limit reached: No availability for {room.type} on {date_str}.")

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

        # Determine initial booking status
        initial_status = data.get("status")
        if not initial_status:
            # Fallback logic if status is not explicitly provided in the payload
            from models.user import UserModel
            user = UserModel.query.get(booked_by)
            if user and user.role == "admin":
                initial_status = "confirmed"
            else:
                initial_status = "pending"

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
            status=initial_status,
            booked_by=booked_by,
            payment_type=payment_type,
            meal_plan=meal_plan,
            price_per_night=float(price_per_night) if price_per_night is not None else None,
            total_price=float(total_price) if total_price is not None else None
        )
        
        # Automatically update room status to booked ONLY if confirmed immediately
        if initial_status == "confirmed":
            room.status = "booked"

        db.session.add(booking)
        db.session.flush() # Flush to populate booking ID

        # Create notification for admin
        from models.notification import NotificationModel
        food_status = "Without Food" if "without" in meal_plan.lower() else "With Food"
        notif_msg = f"New pending booking {booking_id} request from {guest_name} for Room {room.room_number} [{food_status} - {meal_plan}]."
        if initial_status == "confirmed":
            notif_msg = f"New booking {booking_id} confirmed by Admin for Room {room.room_number} [{food_status} - {meal_plan}]."
            
        notification = NotificationModel(
            booking_id=booking_id,
            message=notif_msg,
            is_read=False
        )
        db.session.add(notification)
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

    @classmethod
    def confirm_booking(cls, booking_id, room_id=None):
        """Confirms a pending booking, allocates the room if provided, and sets room status to booked."""
        booking = BookingModel.query.get(booking_id)
        if not booking:
            raise ValueError("Reservation not found.")
            
        if booking.status != "pending":
            raise ValueError(f"Only pending bookings can be confirmed. Current status is {booking.status}.")

        if room_id:
            room = RoomModel.query.get(int(room_id))
            if not room:
                raise ValueError("Selected room does not exist.")
        else:
            room = RoomModel.query.get(booking.room_id)

        if room:
            if room.status == "maintenance":
                raise ValueError("This room is currently under maintenance and cannot be booked.")
            
            # Check for scheduling overlap conflicts
            conflicting_booking = BookingModel.query.filter(
                BookingModel.room_id == room.id,
                BookingModel.status == "confirmed",
                BookingModel.id != booking.id,
                BookingModel.check_in < booking.check_out,
                BookingModel.check_out > booking.check_in
            ).first()

            if conflicting_booking:
                raise ValueError(
                    f"Booking conflict: Room {room.room_number} is already reserved "
                    f"between {conflicting_booking.check_in.strftime('%Y-%m-%d %H:%M')} "
                    f"and {conflicting_booking.check_out.strftime('%Y-%m-%d %H:%M')}."
                )

            booking.room_id = room.id

        booking.status = "confirmed"
        
        if room:
            room.status = "booked"

        db.session.commit()
        return cls.to_dict(booking)

