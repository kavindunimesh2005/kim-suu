"""Vercel serverless function entrypoint."""
import os
import sys
from pathlib import Path

# Add project root to sys.path so backend package can be imported
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app import create_app

# Instantiate Flask application in production mode
app = create_app("production")
