from flask import Blueprint, request, jsonify
from viewmodels.room_viewmodel import RoomViewModel

room_bp = Blueprint("rooms", __name__, url_prefix="/api/rooms")

@room_bp.route("", methods=["GET"])
def get_rooms():
    """Gets the list of all rooms."""
    try:
        rooms = RoomViewModel.get_all_rooms()
        return jsonify(rooms), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch rooms."}), 500

@room_bp.route("", methods=["POST"])
def add_room():
    """Registers a new room (Admin only)."""
    data = request.get_json() or {}
    try:
        new_room = RoomViewModel.create_room(data)
        return jsonify({
            "message": "Room added successfully",
            "room": new_room
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to create room."}), 500

@room_bp.route("/<room_id>", methods=["PUT"])
def edit_room(room_id):
    """Edits details of an existing room (Admin only)."""
    data = request.get_json() or {}
    try:
        updated_room = RoomViewModel.update_room(room_id, data)
        return jsonify({
            "message": "Room updated successfully",
            "room": updated_room
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update room."}), 500

@room_bp.route("/<room_id>", methods=["DELETE"])
def delete_room(room_id):
    """Deletes a room from the database (Admin only)."""
    try:
        RoomViewModel.delete_room(room_id)
        return jsonify({"message": f"Room {room_id} deleted successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to delete room."}), 500
