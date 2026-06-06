from database import db

class GalleryModel(db.Model):
    __tablename__ = 'gallery'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_url = db.Column(db.String(255), nullable=False, unique=True)
    caption = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "imageUrl": self.image_url,
            "caption": self.caption or ""
        }

    def __repr__(self):
        return f"<GalleryImage {self.id}: {self.image_url}>"
