"""Root application entry point for unified single-application deployment."""
import os
import sys
from pathlib import Path
from flask import Flask

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app import create_app

# Top-level Flask application instance for Vercel and production WSGI
app = Flask(__name__)
env_name = os.getenv("FLASK_ENV", "production" if (os.getenv("VERCEL") or os.getenv("RENDER") or os.getenv("RAILWAY_STATIC_URL")) else "development")
app = create_app(env_name)


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for Vercel and monitoring."""
    return {"status": "healthy", "service": "suchetha-portfolio"}


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0").lower() in ("true", "1", "yes")
    print(f" * Suchetha Kapuarachchi Portfolio running on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
