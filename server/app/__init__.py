import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.db import db

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Read environment variables
    user = os.getenv('DB_USER', 'root')
    password = os.getenv('DB_PASSWORD', '')
    host = os.getenv('DB_HOST', 'localhost')
    port = os.getenv('DB_PORT', '3306')
    database = os.getenv('DB_NAME', 'cake_of_paradise')

    # Connect to MySQL using PyMySQL driver
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Enable Cross-Origin Resource Sharing for React (Vite on port 5173)
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

    # Attach database to Flask
    db.init_app(app)

    # Register routes
    from app.routes.order_routes import order_bp
    app.register_blueprint(order_bp, url_prefix='/api/orders')

    return app