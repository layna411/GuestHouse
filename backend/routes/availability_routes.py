from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from database import db
from models.room import RoomModel
from models.booking import BookingModel
from models.room_availability import RoomAvailabilityModel

availability_bp = Blueprint("availability", __name__, url_prefix="/api/availability")

def get_default_capacity(room_type):
    """Returns default room capacities matching the Excel sheet."""
    if "super" in room_type.lower():
        return 6
    return 12

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        return None

@availability_bp.route("", methods=["GET"])
def get_daily_grid():
    """Compiles a rolling 12-day availability grid starting from a given date."""
    start_date_str = request.args.get("startDate")
    if not start_date_str:
        start_date_str = datetime.now().strftime("%Y-%m-%d")
        
    start_date = parse_date(start_date_str)
    if not start_date:
        return jsonify({"error": "Invalid startDate format. Use YYYY-MM-DD."}), 400

    # Generate 12 dates
    dates = []
    for i in range(12):
        dates.append((start_date + timedelta(days=i)).strftime("%Y-%m-%d"))

    room_types = ["Deluxe Room", "Super Deluxe Room"]
    grid_data = {}

    for rt in room_types:
        grid_data[rt] = {}
        default_cap = get_default_capacity(rt)
        for d in dates:
            # Check override
            override = RoomAvailabilityModel.query.filter_by(room_type=rt, date=d).first()
            cap = override.available_count if override else default_cap
            
            # Count bookings overlapping this date
            # stay date d is active if check_in <= d < check_out
            dt = datetime.strptime(d, "%Y-%m-%d")
            # Query active bookings for rooms of this type
            rooms = RoomModel.query.filter_by(type=rt).all()
            room_ids = [r.id for r in rooms]
            
            occupied = 0
            if room_ids:
                occupied = BookingModel.query.filter(
                    BookingModel.room_id.in_(room_ids),
                    BookingModel.status.in_(["confirmed", "pending"]),
                    BookingModel.check_in <= dt,
                    BookingModel.check_out > dt
                ).count()
                
            grid_data[rt][d] = max(0, cap - occupied)

    return jsonify({
        "dates": dates,
        "defaultCapacities": {
            "Deluxe Room": 12,
            "Super Deluxe Room": 6
        },
        "grid": grid_data
    }), 200

@availability_bp.route("/update", methods=["POST"])
def update_override():
    """Sets or updates a daily available room capacity override (Staff only)."""
    data = request.get_json() or {}
    room_type = data.get("roomType")
    date_str = data.get("date")
    count = data.get("count")

    if not room_type or not date_str or count is None:
        return jsonify({"error": "roomType, date, and count are required fields."}), 400

    try:
        count_val = int(count)
        if count_val < 0:
            return jsonify({"error": "Count cannot be negative."}), 400
    except ValueError:
        return jsonify({"error": "Count must be an integer."}), 400

    # Ensure valid date
    if not parse_date(date_str):
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    try:
        override = RoomAvailabilityModel.query.filter_by(room_type=room_type, date=date_str).first()
        if override:
            override.available_count = count_val
        else:
            override = RoomAvailabilityModel(
                room_type=room_type,
                date=date_str,
                available_count=count_val
            )
            db.session.add(override)
        db.session.commit()
        return jsonify({
            "message": "Availability updated successfully.",
            "override": override.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update availability."}), 500

@availability_bp.route("/check", methods=["GET"])
def check_stay_availability():
    """Checks if a room type is available for the given check-in/check-out range."""
    room_type = request.args.get("roomType")
    check_in_str = request.args.get("checkIn")   # Expects YYYY-MM-DD or YYYY-MM-DDTHH:MM
    check_out_str = request.args.get("checkOut") # Expects YYYY-MM-DD or YYYY-MM-DDTHH:MM

    if not room_type or not check_in_str or not check_out_str:
        return jsonify({"error": "roomType, checkIn, and checkOut are required parameters."}), 400

    try:
        # Extract YYYY-MM-DD prefix
        cin_date = datetime.fromisoformat(check_in_str.replace("Z", "")).date()
        cout_date = datetime.fromisoformat(check_out_str.replace("Z", "")).date()
    except Exception:
        # Fallback to date only parsing
        try:
            cin_date = datetime.strptime(check_in_str[:10], "%Y-%m-%d").date()
            cout_date = datetime.strptime(check_out_str[:10], "%Y-%m-%d").date()
        except Exception:
            return jsonify({"error": "Invalid dates. Use ISO format YYYY-MM-DD."}), 400

    if cin_date >= cout_date:
        return jsonify({"error": "Check-in date must be before check-out date."}), 400

    # Iterate over stay dates (exclude checkout date)
    nights = (cout_date - cin_date).days
    min_remaining = get_default_capacity(room_type)
    
    # Query rooms of this type
    rooms = RoomModel.query.filter_by(type=room_type).all()
    room_ids = [r.id for r in rooms]

    for n in range(nights):
        current_date = cin_date + timedelta(days=n)
        date_str = current_date.strftime("%Y-%m-%d")
        dt = datetime.combine(current_date, datetime.min.time())

        # Capacity limit (override or default)
        override = RoomAvailabilityModel.query.filter_by(room_type=room_type, date=date_str).first()
        cap = override.available_count if override else get_default_capacity(room_type)

        # Bookings overlapping this date
        occupied = 0
        if room_ids:
            occupied = BookingModel.query.filter(
                BookingModel.room_id.in_(room_ids),
                BookingModel.status.in_(["confirmed", "pending"]),
                BookingModel.check_in <= dt,
                BookingModel.check_out > dt
            ).count()

        remaining = max(0, cap - occupied)
        if remaining < min_remaining:
            min_remaining = remaining

    return jsonify({
        "roomType": room_type,
        "available": min_remaining > 0,
        "remaining": min_remaining
    }), 200
