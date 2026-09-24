"""Flask application factory."""
import mimetypes
import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
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

# Ensure proper MIME types for JavaScript and CSS on Windows & Linux
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")


def create_app(config_name: str = None) -> Flask:
    """Create and configure an instance of the Flask application."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development").lower()
        
    config_class = config_by_name.get(config_name, config_by_name["default"])
    
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure data and upload directories exist
    try:
        app.config["DATA_FOLDER"].mkdir(parents=True, exist_ok=True)
        app.config["UPLOAD_FOLDER"].mkdir(parents=True, exist_ok=True)
    except OSError:
        pass

    # If running on Vercel serverless, seed /tmp/data and /tmp/uploads from repository
    if os.getenv("VERCEL"):
        import shutil
        source_data = Path(__file__).resolve().parent.parent / "data"
        if source_data.exists():
            for item in source_data.glob("*.json"):
                dest = app.config["DATA_FOLDER"] / item.name
                if not dest.exists():
                    try:
                        shutil.copy2(item, dest)
                    except OSError:
                        pass
        source_uploads = Path(__file__).resolve().parent.parent / "uploads"
        if source_uploads.exists():
            for cat_dir in source_uploads.iterdir():
                if cat_dir.is_dir():
                    dest_cat = app.config["UPLOAD_FOLDER"] / cat_dir.name
                    try:
                        dest_cat.mkdir(parents=True, exist_ok=True)
                        for img in cat_dir.glob("*"):
                            dest_img = dest_cat / img.name
                            if not dest_img.exists():
                                shutil.copy2(img, dest_img)
                    except OSError:
                        pass
    
    # Configure CORS
    cors_origins = app.config.get("CORS_ORIGINS", [])
    if cors_origins:
        CORS(
            app,
            resources={
                r"/api/*": {"origins": cors_origins},
                r"/uploads/*": {"origins": cors_origins}
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
        upload_folder = Path(app.config["UPLOAD_FOLDER"])
        target_file = upload_folder / filename
        if not target_file.is_file():
            return jsonify({
                "success": False,
                "error": "Upload not found",
                "message": f"File '{filename}' does not exist in uploads."
            }), 404
        return send_from_directory(upload_folder, filename)

    # Serve compiled React SPA and handle client-side routing fallback
    dist_folder = Path(app.config["FRONTEND_DIST_FOLDER"])

    @app.route("/", defaults={"path": ""}, methods=["GET", "HEAD"])
    @app.route("/<path:path>", methods=["GET", "HEAD"])
    def serve_react(path: str):
        # 1. API routes safeguard: never intercept API routes with HTML fallback
        if path == "api" or path.startswith("api/"):
            return jsonify({
                "success": False,
                "error": "Resource not found",
                "message": f"API endpoint '/{path}' does not exist."
            }), 404

        # 2. Upload routes safeguard: never intercept uploads with HTML fallback
        if path == "uploads" or path.startswith("uploads/"):
            return jsonify({
                "success": False,
                "error": "Upload not found",
                "message": f"Upload resource '/{path}' does not exist."
            }), 404

        # 3. Check if exact file exists in frontend dist (e.g. assets/..., favicon.ico, images)
        if path:
            candidate_file = dist_folder / path
            if candidate_file.is_file():
                return send_from_directory(dist_folder, path)

        # 4. Fallback to index.html for React Router client-side routes
        index_file = dist_folder / "index.html"
        if index_file.is_file():
            return send_from_directory(dist_folder, "index.html")

        # 5. Informative notice if frontend is not built yet
        return jsonify({
            "success": False,
            "error": "Frontend build not found",
            "message": "The React frontend build was not found. Please run 'npm run build' to generate frontend/dist."
        }), 404

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
        if request.path.startswith("/api/"):
            return jsonify({
                "success": False,
                "error": "Resource not found",
                "message": f"Endpoint '{request.path}' was not found on this server."
            }), 404

        if request.path.startswith("/uploads/"):
            return jsonify({
                "success": False,
                "error": "Upload not found",
                "message": f"Upload resource '{request.path}' was not found."
            }), 404

        if request.method in ("GET", "HEAD"):
            dist_dir = Path(app.config.get("FRONTEND_DIST_FOLDER", ""))
            index_file = dist_dir / "index.html"
            if index_file.is_file():
                return send_from_directory(dist_dir, "index.html")

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
