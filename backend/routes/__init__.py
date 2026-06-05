from routes.auth_routes import auth_bp
from routes.room_routes import room_bp
from routes.booking_routes import booking_bp
from routes.customer_routes import customer_bp
from routes.notification_routes import notification_bp
from routes.portal_routes import portal_bp

# Package exports for blueprints
__all__ = ['auth_bp', 'room_bp', 'booking_bp', 'customer_bp', 'notification_bp', 'portal_bp']

