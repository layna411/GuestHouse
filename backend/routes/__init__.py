from routes.auth_routes import auth_bp
from routes.room_routes import room_bp
from routes.booking_routes import booking_bp
from routes.employee_routes import employee_bp
from routes.portal_routes import portal_bp

# Package exports for blueprints
__all__ = ['auth_bp', 'room_bp', 'booking_bp', 'employee_bp', 'portal_bp']
