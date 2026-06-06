from flask import Blueprint, request, jsonify
from viewmodels.user_viewmodel import UserViewModel

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    """Handles admin and employee logins."""
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # 'admin' or 'employee' (optional)

    if not email or not password:
        return jsonify({"error": "Email and password are required fields."}), 400

    authenticated_user = UserViewModel.authenticate(email, password, role)
    if authenticated_user:
        return jsonify({
            "message": "Login successful",
            "user": authenticated_user
        }), 200
    
    return jsonify({"error": "Invalid email, password, or role combination."}), 401

@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """Updates active user profile details."""
    data = request.get_json() or {}
    user_id = data.get("id")

    if not user_id:
        return jsonify({"error": "User ID is required to update profile."}), 400

    try:
        updated_user = UserViewModel.update_profile(user_id, data)
        return jsonify({
            "message": "Profile updated successfully",
            "user": updated_user
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal server error occurred."}), 500

@auth_bp.route("/register", methods=["POST"])
def register():
    """Handles customer sign up."""
    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    phone = data.get("phone", "")
    
    if not email or not name or not password:
        return jsonify({"error": "Name, email, and password are required fields."}), 400
        
    try:
        import uuid
        user_id = f"cust_{uuid.uuid4().hex[:8]}"
        new_user = UserViewModel.create_user(
            user_id=user_id,
            name=name,
            email=email,
            password=password,
            role="staff",
            department="Guest Relations",
            phone=phone
        )
        return jsonify({
            "message": "Registration successful",
            "user": new_user
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to register user."}), 500

