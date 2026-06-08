from database import db
from datetime import datetime

class ReviewModel(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reviewer_name = db.Column(db.String(100), nullable=False)
    reviewer_email = db.Column(db.String(100), nullable=False)
    reviewer_country = db.Column(db.String(50), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    rating_text = db.Column(db.String(50), nullable=False)
    comments = db.Column(db.Text, nullable=False)
    date_str = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "source": "our",
            "rating": self.rating,
            "ratingText": self.rating_text,
            "reviewerName": self.reviewer_name,
            "reviewerCountry": self.reviewer_country or "🇮🇳",
            "date": self.date_str,
            "comments": self.comments
        }

    def __repr__(self):
        return f"<Review {self.id} by {self.reviewer_name}>"
