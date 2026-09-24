"""Vercel serverless function entrypoint."""
import os
import sys
import traceback
from pathlib import Path

# Add project root and potential Vercel Lambda locations to sys.path
file_path = Path(__file__).resolve()
for candidate in [
    file_path.parent.parent,  # /var/task when file is in /var/task/api/index.py
    file_path.parent,         # /var/task when file is in /var/task/index.py
    Path.cwd(),               # Current working directory
    Path("/var/task"),        # Standard AWS Lambda / Vercel runtime directory
]:
    p = str(candidate)
    if candidate.exists() and p not in sys.path:
        sys.path.insert(0, p)

os.environ["VERCEL"] = "1"

print(f"[VERCEL INIT] Loading backend from sys.path={sys.path[:4]} cwd={os.getcwd()}", file=sys.stderr)

try:
    from backend.app import create_app

    # Create production Flask instance
    app = create_app("production")

    @app.before_request
    def handle_vercel_rewrite():
        """Ensure original request URI is respected if rewritten by Vercel."""
        from flask import request
        matched_path = request.headers.get("x-matched-path")
        if matched_path and (matched_path.startswith("/api") or matched_path.startswith("/uploads")):
            # matched_path is available for inspection if needed
            pass

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "healthy", "service": "suchetha-portfolio"}

    print("[VERCEL INIT] Backend successfully initialized", file=sys.stderr)

except Exception as err:
    from flask import Flask, jsonify
    err_msg = str(err)
    err_tb = traceback.format_exc()
    print(f"[VERCEL ERROR] Initialization failed:\n{err_tb}", file=sys.stderr)
    app = Flask(__name__)

    @app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    @app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    def error_handler(path):
        return jsonify({
            "success": False,
            "error": "Backend initialization error",
            "message": err_msg,
            "traceback": err_tb,
            "cwd": os.getcwd(),
            "sys_path": sys.path
        }), 500
