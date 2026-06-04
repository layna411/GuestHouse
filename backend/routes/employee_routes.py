from flask import Blueprint, request, jsonify
from viewmodels.user_viewmodel import UserViewModel

employee_bp = Blueprint("employees", __name__, url_prefix="/api/employees")

@employee_bp.route("", methods=["GET"])
def get_employees():
    """Retrieves all registered employees."""
    try:
        employees = UserViewModel.get_all_employees()
        return jsonify(employees), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch employees."}), 500

@employee_bp.route("", methods=["POST"])
def add_employee():
    """Adds a new employee into the system."""
    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name")
    department = data.get("department")
    phone = data.get("phone")
    password = data.get("password", "password123")  # Default employee password if none provided

    if not email or not name:
        return jsonify({"error": "Name and email are required fields."}), 400

    # Auto-generate employee ID
    employees = UserViewModel.get_all_employees()
    emp_id = f"emp{str(len(employees) + 1).zfill(3)}"

    try:
        new_employee = UserViewModel.create_user(
            user_id=emp_id,
            name=name,
            email=email,
            password=password,
            role="employee",
            department=department,
            phone=phone
        )
        return jsonify({
            "message": "Employee added successfully",
            "employee": new_employee
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to add employee."}), 500

@employee_bp.route("/<emp_id>", methods=["PUT"])
def edit_employee(emp_id):
    """Updates properties of an employee."""
    data = request.get_json() or {}
    try:
        # Merge updated properties
        data["id"] = emp_id
        updated = UserViewModel.update_profile(emp_id, data)
        return jsonify({
            "message": "Employee updated successfully",
            "employee": updated
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update employee."}), 500

@employee_bp.route("/<emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    """Removes an employee from the system."""
    try:
        UserViewModel.delete_employee(emp_id)
        return jsonify({"message": f"Employee {emp_id} removed successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to delete employee."}), 500
