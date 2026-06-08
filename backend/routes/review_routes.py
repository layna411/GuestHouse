from flask import Blueprint, request, jsonify
from models.review import ReviewModel
from database import db

review_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")

@review_bp.route("", methods=["GET"])
def get_reviews():
    """Retrieves all reviews from the database."""
    try:
        reviews = ReviewModel.query.order_by(ReviewModel.created_at.desc()).all()
        return jsonify([r.to_dict() for r in reviews]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch reviews."}), 500

@review_bp.route("", methods=["POST"])
def add_review():
    """Submits a new review to the database."""
    data = request.get_json() or {}
    rating = data.get("rating")
    rating_text = data.get("ratingText", "Good")
    name = data.get("reviewerName")
    email = data.get("reviewerEmail", "")
    if not email:
        email = data.get("email", "")
    country = data.get("reviewerCountry", "🇮🇳")
    date_str = data.get("date")
    comments = data.get("comments", "")

    if not name or rating is None or not comments:
        return jsonify({"error": "Name, rating, and comments are required."}), 400

    try:
        new_review = ReviewModel(
            reviewer_name=name,
            reviewer_email=email,
            reviewer_country=country,
            rating=int(rating),
            rating_text=rating_text,
            comments=comments,
            date_str=date_str
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({
            "message": "Review submitted successfully.",
            "review": new_review.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save review."}), 500
