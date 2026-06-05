from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from routes import auth_bp, room_bp, booking_bp, customer_bp, notification_bp, portal_bp
import os

def create_app(config_class=Config):
    """Factory function to build and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    # React frontend usually runs on http://localhost:5173 or pnpm dev.
    # Allowing all origins in development mode for maximum user-friendliness.
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize database
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(portal_bp)   # Serves developer dashboard and DB status
    app.register_blueprint(auth_bp)     # Serves login / session profile updates
    app.register_blueprint(room_bp)     # Serves rooms CRUD APIs
    app.register_blueprint(booking_bp)  # Serves reservation placements & status transitions
    app.register_blueprint(customer_bp) # Serves customer listings & CRUD
    app.register_blueprint(notification_bp) # Serves notifications API

    return app

if __name__ == "__main__":
    # Create the Flask application
    app = create_app()

    # Log setup instructions for developer user-friendliness
    print("\n" + "="*80)
    print(" GUEST HOUSE BOOKING BACKEND SERVER STARTED SUCCESSFULY")
    print("="*80)
    print(" * Local API Host:       http://127.0.0.1:5000")
    print(" * Developer Console UI: http://127.0.0.1:5000/")
    print("="*80)
    print(" NOTE: Make sure XAMPP MySQL is active.")
    print(" If tables are missing, click 'Reset & Seed Database' on the Developer Console.")
    print("="*80 + "\n")

    # Run Flask server
    app.run(host="0.0.0.0", port=5000, debug=True)
