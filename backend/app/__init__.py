import os
import sys

from flask import Flask, jsonify, request, send_from_directory
from app.routes.books_routes import books_bp
from app.routes.blogs_routes import blogs_bp
from app.routes.stories_routes import stories_bp
from app.routes.gallery_routes import gallery_bp
from app.routes.author_routes import author_bp
from app.routes.contact_routes import contact_bp
from app.routes.settings_routes import settings_bp
from app.routes.admin_routes import admin_bp
from app.routes.upload_routes import upload_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'suchetha-kapuarachchi-secret-key-2026')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload

    # Global CORS handler
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Admin-Token, X-Requested-With'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
        return response

    # Handle OPTIONS preflight
    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        return ('', 204)

    # Health check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Suchetha Kapuarachchi Author Portfolio API",
            "version": "1.0.0"
        })

    # Register Blueprints
    app.register_blueprint(books_bp, url_prefix='/api/books')
    app.register_blueprint(blogs_bp, url_prefix='/api/blogs')
    app.register_blueprint(stories_bp, url_prefix='/api/stories')
    app.register_blueprint(gallery_bp, url_prefix='/api/gallery')
    app.register_blueprint(author_bp, url_prefix='/api/author')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')

    # Serve uploads directly
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')
    try:
        os.makedirs(uploads_dir, exist_ok=True)
    except OSError:
        pass

    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        if os.path.exists(os.path.join(uploads_dir, filename)):
            return send_from_directory(uploads_dir, filename)
        return jsonify({"error": "File not found"}), 404

    # Locate frontend build directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    possible_dist_dirs = [
        os.path.join(base_dir, 'dist'),
        os.path.join(base_dir, '..', 'dist'),
        os.path.join(base_dir, '..', 'frontend', 'dist'),
        os.path.join(base_dir, 'frontend', 'dist')
    ]
    dist_dir = next((d for d in possible_dist_dirs if os.path.exists(d)), possible_dist_dirs[0])

    # Serve static assets from dist
    @app.route('/assets/<path:filename>')
    def serve_dist_assets(filename):
        assets_dir = os.path.join(dist_dir, 'assets')
        if os.path.exists(os.path.join(assets_dir, filename)):
            return send_from_directory(assets_dir, filename)
        return jsonify({"error": "Asset not found", "status": 404}), 404

    # Serve SPA routes and static files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path):
        if path.startswith('api/') or path.startswith('uploads/'):
            return jsonify({"error": "Resource not found", "status": 404}), 404
        if path != "" and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
        if os.path.exists(os.path.join(dist_dir, 'index.html')):
            return send_from_directory(dist_dir, 'index.html')
        return jsonify({
            "status": "Backend running",
            "message": "Frontend build files not found. Run 'npm run build' to generate dist folder."
        })

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        if request.path.startswith('/api/') or request.path.startswith('/uploads/'):
            return jsonify({"error": "Resource not found", "status": 404}), 404
        if os.path.exists(os.path.join(dist_dir, 'index.html')):
            return send_from_directory(dist_dir, 'index.html')
        return jsonify({"error": "Resource not found", "status": 404}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error", "status": 500}), 500

    return app
