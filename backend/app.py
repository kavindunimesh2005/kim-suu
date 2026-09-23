"""Main application entry point."""
import os
import sys
from pathlib import Path

# Add backend directory to sys.path to allow absolute imports
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    host = app.config.get("HOST", "0.0.0.0")
    port = app.config.get("PORT", 5000)
    debug = app.config.get("DEBUG", True)
    print(f" * Suchetha Kapuarachchi Portfolio Backend starting on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
