"""Routes package registering all modular blueprints."""
from backend.app.routes.health_routes import health_bp
from backend.app.routes.auth_routes import auth_bp
from backend.app.routes.admin_routes import admin_bp
from backend.app.routes.books_routes import books_bp
from backend.app.routes.blogs_routes import blogs_bp
from backend.app.routes.stories_routes import stories_bp
from backend.app.routes.gallery_routes import gallery_bp
from backend.app.routes.author_routes import author_bp
from backend.app.routes.contact_routes import contact_bp
from backend.app.routes.settings_routes import settings_bp
from backend.app.routes.upload_routes import upload_bp

__all__ = [
    "health_bp",
    "auth_bp",
    "admin_bp",
    "books_bp",
    "blogs_bp",
    "stories_bp",
    "gallery_bp",
    "author_bp",
    "contact_bp",
    "settings_bp",
    "upload_bp"
]
