"""Root application entry point for unified single-application deployment."""
import os
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app import create_app

# Instantiate Flask application
env_name = os.getenv("FLASK_ENV", "production" if (os.getenv("VERCEL") or os.getenv("RENDER") or os.getenv("RAILWAY_STATIC_URL")) else "development")
app = create_app(env_name)

if __name__ == "__main__":
    host = os.getenv("HOST", app.config.get("HOST", "0.0.0.0"))
    port = int(os.getenv("PORT", str(app.config.get("PORT", 5000))))
    debug = app.config.get("DEBUG", False)
    print(f" * Suchetha Kapuarachchi Portfolio running on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
