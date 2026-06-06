from flask import Blueprint, request, jsonify
from viewmodels.user_viewmodel import UserViewModel

customer_bp = Blueprint("customers", __name__, url_prefix="/api/customers")

@customer_bp.route("", methods=["GET"])
def get_customers():
    """Retrieves all registered customers."""
    try:
        customers = UserViewModel.get_all_customers()
        return jsonify(customers), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch customers."}), 500

@customer_bp.route("", methods=["POST"])
def add_customer():
    """Adds a new staff/customer account into the system."""
    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name")
    phone = data.get("phone")
    password = data.get("password", "password123")  # Default password if none provided
    role = data.get("role", "staff")
    department = data.get("department", "Guest Relations")

    if not email or not name:
        return jsonify({"error": "Name and email are required fields."}), 400

    # Auto-generate customer ID
    import uuid
    cust_id = f"cust_{uuid.uuid4().hex[:8]}"

    try:
        new_customer = UserViewModel.create_user(
            user_id=cust_id,
            name=name,
            email=email,
            password=password,
            role=role,
            department=department,
            phone=phone
        )
        return jsonify({
            "message": "Staff account added successfully",
            "customer": new_customer
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to add customer."}), 500

@customer_bp.route("/<cust_id>", methods=["PUT"])
def edit_customer(cust_id):
    """Updates properties of a customer."""
    data = request.get_json() or {}
    try:
        data["id"] = cust_id
        updated = UserViewModel.update_profile(cust_id, data)
        return jsonify({
            "message": "Customer updated successfully",
            "customer": updated
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update customer."}), 500

@customer_bp.route("/<cust_id>", methods=["DELETE"])
def delete_customer(cust_id):
    """Removes a customer from the system."""
    try:
        UserViewModel.delete_customer(cust_id)
        return jsonify({"message": f"Customer {cust_id} removed successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to delete customer."}), 500

@customer_bp.route("/<cust_id>/toggle-active", methods=["PUT"])
def toggle_customer_active(cust_id):
    """Toggles a staff member's login access (active/inactive)."""
    try:
        from models.user import UserModel
        from database import db
        user = UserModel.query.get(cust_id)
        if not user:
            return jsonify({"error": "Staff member not found."}), 404
        user.is_active = not user.is_active
        db.session.commit()
        return jsonify({
            "message": "Staff login status updated successfully",
            "customer": UserViewModel.to_dict(user)
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to update staff status."}), 500
