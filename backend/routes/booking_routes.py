from flask import Blueprint, request, jsonify
from viewmodels.booking_viewmodel import BookingViewModel

booking_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

@booking_bp.route("", methods=["GET"])
def get_bookings():
    """Retrieves all reservations or filters by booker ID."""
    booked_by = request.args.get("bookedBy")
    try:
        if booked_by:
            bookings = BookingViewModel.get_employee_bookings(booked_by)
        else:
            bookings = BookingViewModel.get_all_bookings()
        return jsonify(bookings), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch bookings."}), 500

@booking_bp.route("", methods=["POST"])
def make_booking():
    """Creates a new room booking. Validates dates and checks for conflicts."""
    data = request.get_json() or {}
    try:
        new_booking = BookingViewModel.create_booking(data)
        return jsonify({
            "message": "Booking confirmed successfully!",
            "booking": new_booking
        }), 201
    except ValueError as e:
        # Handles validation errors e.g. conflict, bad dates, invalid guest counts
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred while placing the booking."}), 500

@booking_bp.route("/<booking_id>/cancel", methods=["POST"])
def cancel_booking(booking_id):
    """Cancels a confirmed reservation."""
    try:
        updated_booking = BookingViewModel.cancel_booking(booking_id)
        return jsonify({
            "message": "Booking cancelled successfully.",
            "booking": updated_booking
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to cancel booking."}), 500

@booking_bp.route("/<booking_id>/complete", methods=["POST"])
def complete_booking(booking_id):
    """Marks a booking as completed/checked out."""
    try:
        updated_booking = BookingViewModel.complete_booking(booking_id)
        return jsonify({
            "message": "Booking marked as completed.",
            "booking": updated_booking
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to complete booking."}), 500

@booking_bp.route("/<booking_id>/confirm", methods=["POST"])
def confirm_booking(booking_id):
    """Confirms a pending reservation."""
    try:
        data = request.get_json() or {}
        room_id = data.get("roomId")
        updated_booking = BookingViewModel.confirm_booking(booking_id, room_id=room_id)
        return jsonify({
            "message": "Booking confirmed successfully.",
            "booking": updated_booking
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to confirm booking."}), 500

@booking_bp.route("/revenue", methods=["GET"])
def get_revenue_stats():
    """Compiles total revenue as on date and monthly earnings breakdowns."""
    try:
        from datetime import datetime
        from database import db
        from models.booking import BookingModel
        from sqlalchemy import func
        
        # Calculate total revenue
        total_rev_query = db.session.query(func.sum(BookingModel.total_price)).filter(
            BookingModel.status.in_(["confirmed", "completed"])
        ).scalar()
        total_revenue = float(total_rev_query) if total_rev_query is not None else 0.0

        # Group bookings by month
        monthly_stats = {}
        bookings = BookingModel.query.filter(
            BookingModel.status.in_(["confirmed", "completed"])
        ).all()

        for b in bookings:
            month_name = b.check_in.strftime("%b")
            monthly_stats[month_name] = monthly_stats.get(month_name, 0.0) + float(b.total_price or 0)

        # Standard month sorting order
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        monthly_list = []
        for m in month_order:
            if m in monthly_stats or m == datetime.now().strftime("%b"):
                monthly_list.append({
                    "month": m,
                    "revenue": monthly_stats.get(m, 0.0)
                })

        return jsonify({
            "totalRevenue": total_revenue,
            "monthlyRevenue": monthly_list
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch revenue statistics: {str(e)}"}), 500

