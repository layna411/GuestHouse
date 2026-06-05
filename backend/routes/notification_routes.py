from flask import Blueprint, request, jsonify
from database import db
from models.notification import NotificationModel

notification_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")

@notification_bp.route("", methods=["GET"])
def get_notifications():
    """Retrieves all notifications sorted by creation date."""
    try:
        notifications = NotificationModel.query.order_by(NotificationModel.created_at.desc()).all()
        return jsonify([n.to_dict() for n in notifications]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch notifications."}), 500

@notification_bp.route("/<int:notification_id>/read", methods=["PUT"])
def mark_read(notification_id):
    """Marks a single notification as read."""
    try:
        notification = NotificationModel.query.get(notification_id)
        if not notification:
            return jsonify({"error": "Notification not found."}), 404
        notification.is_read = True
        db.session.commit()
        return jsonify({"message": "Notification marked as read.", "notification": notification.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": "Failed to mark notification as read."}), 500

@notification_bp.route("/read-all", methods=["PUT"])
def mark_all_read():
    """Marks all notifications as read."""
    try:
        NotificationModel.query.filter_by(is_read=False).update({NotificationModel.is_read: True})
        db.session.commit()
        return jsonify({"message": "All notifications marked as read."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to mark all notifications as read."}), 500
