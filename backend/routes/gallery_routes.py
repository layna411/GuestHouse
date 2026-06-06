from flask import Blueprint, request, jsonify
from database import db
from models.gallery import GalleryModel

gallery_bp = Blueprint("gallery", __name__, url_prefix="/api/gallery")

@gallery_bp.route("", methods=["GET"])
def get_gallery():
    """Retrieves all gallery photos."""
    try:
        photos = GalleryModel.query.all()
        return jsonify([p.to_dict() for p in photos]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch gallery photos."}), 500

@gallery_bp.route("", methods=["POST"])
def add_gallery_photo():
    """Adds a new photo to the gallery showcase (Staff only)."""
    data = request.get_json() or {}
    image_url = data.get("imageUrl")
    caption = data.get("caption", "")

    if not image_url:
        return jsonify({"error": "Image URL is a required field."}), 400

    try:
        # Check if already exists
        existing = GalleryModel.query.filter_by(image_url=image_url).first()
        if existing:
            return jsonify({"error": "This image is already in the gallery."}), 400

        photo = GalleryModel(image_url=image_url, caption=caption)
        db.session.add(photo)
        db.session.commit()
        return jsonify({
            "message": "Photo added to gallery successfully",
            "photo": photo.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to add photo to gallery."}), 500

@gallery_bp.route("/<int:photo_id>", methods=["DELETE"])
def delete_gallery_photo(photo_id):
    """Removes a photo from the gallery showcase (Staff only)."""
    try:
        photo = GalleryModel.query.get(photo_id)
        if not photo:
            return jsonify({"error": "Photo not found."}), 404
        db.session.delete(photo)
        db.session.commit()
        return jsonify({"message": f"Photo {photo_id} removed successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete photo from gallery."}), 500

@gallery_bp.route("/upload", methods=["POST"])
def upload_file():
    """Uploads an image file to the static uploads directory."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    try:
        import os
        import uuid
        from flask import current_app
        from werkzeug.utils import secure_filename

        # Create uploads folder inside static if it doesn't exist
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        filename = secure_filename(file.filename)
        # Append unique prefix to avoid conflicts
        unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        image_url = f"/api/gallery/uploads/{unique_filename}"
        return jsonify({"imageUrl": image_url}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to upload file: {str(e)}"}), 500

@gallery_bp.route("/uploads/<filename>", methods=["GET"])
def get_uploaded_file(filename):
    """Serves an uploaded image file."""
    import os
    from flask import current_app, send_from_directory
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    return send_from_directory(upload_folder, filename)

