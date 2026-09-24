"""Vercel serverless function entrypoint."""
import os
import sys
from pathlib import Path

# Add project root to sys.path so backend can be imported
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

os.environ["VERCEL"] = "1"

from backend.app import create_app

# Create production Flask instance
app = create_app("production")


class VercelPathMiddleware:
    """WSGI middleware to handle Vercel internal rewrites gracefully."""
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        matched_path = (
            environ.get("HTTP_X_MATCHED_PATH")
            or environ.get("RAW_URI")
            or environ.get("REQUEST_URI")
        )
        if matched_path and (matched_path.startswith("/api") or matched_path.startswith("/uploads")):
            path = matched_path.split("?")[0]
            environ["PATH_INFO"] = path
        return self.wsgi_app(environ, start_response)


app.wsgi_app = VercelPathMiddleware(app.wsgi_app)


@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "healthy", "service": "suchetha-portfolio"}
