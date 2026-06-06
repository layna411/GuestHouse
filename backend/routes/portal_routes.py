from flask import Blueprint, render_template, jsonify, current_app
from database import db
from models.room import RoomModel
from models.booking import BookingModel
from models.user import UserModel
import os

portal_bp = Blueprint("portal", __name__, template_folder="../templates", static_folder="../static")

@portal_bp.route("/", methods=["GET"])
def index():
    """Serves the premium Developer Web Console UI."""
    return render_template("console.html")

@portal_bp.route("/api/db-status", methods=["GET"])
def db_status():
    """Diagnoses the XAMPP MySQL database connection and compiles system metrics."""
    try:
        # Check database connection by running a simple text query
        db.session.execute(db.text("SELECT 1"))
        
        # Connection is valid! Gather statistics
        total_rooms = RoomModel.query.count()
        vacant_rooms = RoomModel.query.filter_by(status="vacant").count()
        booked_rooms = RoomModel.query.filter_by(status="booked").count()
        maintenance_rooms = RoomModel.query.filter_by(status="maintenance").count()
        
        total_bookings = BookingModel.query.count()
        active_bookings = BookingModel.query.filter_by(status="confirmed").count()
        
        total_employees = UserModel.query.filter_by(role="staff").count()
        total_admins = UserModel.query.filter_by(role="admin").count()
        
        return jsonify({
            "connected": True,
            "stats": {
                "rooms": {
                    "total": total_rooms,
                    "vacant": vacant_rooms,
                    "booked": booked_rooms,
                    "maintenance": maintenance_rooms
                },
                "bookings": {
                    "total": total_bookings,
                    "active": active_bookings
                },
                "users": {
                    "employees": total_employees,
                    "admins": total_admins
                }
            }
        }), 200
    except Exception as e:
        # Connection failed or database hasn't been initialized
        return jsonify({
            "connected": False,
            "error": str(e),
            "help": "Please ensure XAMPP is running and MySQL module is started. Next, verify that the 'GuestHouse' database has been initialized by clicking the Initialize Database button."
        }), 200

@portal_bp.route("/api/db-reset", methods=["POST"])
def db_reset():
    """Resets the database by wiping tables and running the seeder again."""
    try:
        from init_db import seed_all_tables
    except ImportError:
        import sys
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from init_db import seed_all_tables
        
    try:
        seed_all_tables(reset=True)
        return jsonify({"message": "Database reset and seeded with mock data successfully!"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to reset database: {str(e)}"}), 500
