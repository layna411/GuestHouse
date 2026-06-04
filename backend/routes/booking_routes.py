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
