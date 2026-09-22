import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

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
    uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(uploads_dir, filename)

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found", "status": 404}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error", "status": 500}), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Suchetha Kapuarachchi Portfolio Backend on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
