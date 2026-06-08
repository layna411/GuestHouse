from database import db
from datetime import datetime

class CustomerModel(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone or "",
            "createdAt": self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<Customer {self.name} ({self.email})>"
