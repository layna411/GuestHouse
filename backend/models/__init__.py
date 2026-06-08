from database import db
from models.user import UserModel
from models.room import RoomModel
from models.booking import BookingModel
from models.notification import NotificationModel
from models.room_availability import RoomAvailabilityModel
from models.gallery import GalleryModel
from models.review import ReviewModel
from models.customer import CustomerModel

# Package exports for models
__all__ = ['db', 'UserModel', 'RoomModel', 'BookingModel', 'NotificationModel', 'RoomAvailabilityModel', 'GalleryModel', 'ReviewModel', 'CustomerModel']
