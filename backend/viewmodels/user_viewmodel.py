from database import db
from models.user import UserModel

class UserViewModel:
    @staticmethod
    def to_dict(user):
        """Converts a UserModel instance into a JSON-friendly dictionary."""
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department or "",
            "phone": user.phone or ""
        }

    @classmethod
    def authenticate(cls, email, password, role=None):
        """Authenticates a user based on email, password, and optional expected role."""
        if role:
            user = UserModel.query.filter_by(email=email, role=role).first()
        else:
            user = UserModel.query.filter_by(email=email).first()

        if user and user.check_password(password):
            return cls.to_dict(user)
        
        # Supporting a fallback standard password check for '@simats.edu' standard logins
        # as described in App.tsx: email.includes('@simats.edu') && password === 'password123'
        if not user and email.endswith("@simats.edu") and password == "password123":
            # If role is not provided, determine it from the email
            determined_role = role if role else ("admin" if "admin" in email.lower() else "customer")
            
            # Auto-create the user in database if it doesn't exist for seamless user-friendliness
            username = email.split("@")[0].replace(".", " ").title()
            user_id = f"user_{email.split('@')[0]}"
            new_user = cls.create_user(
                user_id=user_id,
                name=username,
                email=email,
                password=password,
                role=determined_role,
                department="Guest Relations" if determined_role == "customer" else "Administration",
                phone=""
            )
            return new_user
            
        return None

    @classmethod
    def create_user(cls, user_id, name, email, password, role, department=None, phone=None):
        """Creates a new user account, securing the password with a hash."""
        # Validation checks
        if not email or not name or not password or not role:
            raise ValueError("Name, email, password, and role are required.")
            
        existing_user = UserModel.query.filter_by(email=email).first()
        if existing_user:
            raise ValueError("A user with this email address already exists.")

        user = UserModel(
            id=user_id,
            name=name,
            email=email,
            role=role,
            department=department,
            phone=phone
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        return cls.to_dict(user)

    @classmethod
    def update_profile(cls, user_id, data):
        """Updates profile details for an existing user."""
        user = UserModel.query.get(user_id)
        if not user:
            raise ValueError("User not found.")

        # Update text fields
        if "name" in data and data["name"]:
            user.name = data["name"]
        
        if "email" in data and data["email"]:
            # Check email uniqueness
            if data["email"] != user.email:
                existing_email = UserModel.query.filter_by(email=data["email"]).first()
                if existing_email:
                    raise ValueError("This email is already in use by another account.")
                user.email = data["email"]
                
        if "department" in data:
            user.department = data["department"]
            
        if "phone" in data:
            user.phone = data["phone"]

        if "password" in data and data["password"]:
            user.set_password(data["password"])

        db.session.commit()
        return cls.to_dict(user)

    @classmethod
    def get_all_customers(cls):
        """Returns a list of all customers in the system."""
        customers = UserModel.query.filter_by(role="customer").all()
        return [cls.to_dict(cust) for cust in customers]

    @classmethod
    def delete_customer(cls, cust_id):
        """Deletes a customer from the system."""
        user = UserModel.query.filter_by(id=cust_id, role="customer").first()
        if not user:
            raise ValueError("Customer not found.")
        
        db.session.delete(user)
        db.session.commit()
        return True
