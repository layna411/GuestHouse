from database import db
from models.user import UserModel
from models.room import RoomModel
from models.booking import BookingModel
from models.notification import NotificationModel

# Package exports for models
__all__ = ['db', 'UserModel', 'RoomModel', 'BookingModel', 'NotificationModel']
