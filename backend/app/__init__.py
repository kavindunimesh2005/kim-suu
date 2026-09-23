"""Flask application factory."""
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from backend.app.config import config_by_name
from backend.app.routes import (
    health_bp,
    auth_bp,
    admin_bp,
    books_bp,
    blogs_bp,
    stories_bp,
    gallery_bp,
    author_bp,
    contact_bp,
    settings_bp,
    upload_bp
)


def create_app(config_name: str = None) -> Flask:
    """Create and configure an instance of the Flask application."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development").lower()
        
    config_class = config_by_name.get(config_name, config_by_name["default"])
    
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure data and upload directories exist
    app.config["DATA_FOLDER"].mkdir(parents=True, exist_ok=True)
    app.config["UPLOAD_FOLDER"].mkdir(parents=True, exist_ok=True)
    
    # Configure CORS
    CORS(
        app,
        resources={
            r"/api/*": {"origins": app.config["CORS_ORIGINS"]},
            r"/uploads/*": {"origins": app.config["CORS_ORIGINS"]}
        },
        supports_credentials=True
    )
    
    # Register blueprints under /api prefix
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(books_bp, url_prefix="/api")
    app.register_blueprint(blogs_bp, url_prefix="/api")
    app.register_blueprint(stories_bp, url_prefix="/api")
    app.register_blueprint(gallery_bp, url_prefix="/api")
    app.register_blueprint(author_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(settings_bp, url_prefix="/api")
    app.register_blueprint(upload_bp, url_prefix="/api")
    
    # Serve uploaded static media files
    @app.route("/uploads/<path:filename>", methods=["GET"])
    def serve_uploaded_file(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
        
    # Global error handlers for consistent JSON API responses
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": "Bad request",
            "message": str(error)
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": "Resource not found",
            "message": str(error)
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "error": "Method not allowed for requested URL",
            "message": str(error)
        }), 405

    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({
            "success": False,
            "error": "Payload too large. File size exceeds maximum allowed limit (5MB).",
            "message": str(error)
        }), 413

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred on the server."
        }), 500
        
    return app
