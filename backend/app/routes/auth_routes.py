"""Authentication routes."""
from flask import Blueprint, request, jsonify, g
from backend.app.auth.auth_service import authenticate_admin, update_admin_profile
from backend.app.auth.decorators import admin_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    """Admin login endpoint."""
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "").strip()
    password = payload.get("password", "").strip()
    
    if not username or not password:
        return jsonify({
            "success": False,
            "error": "Both username and password are required"
        }), 400
        
    success, data, error = authenticate_admin(username, password)
    if not success:
        return jsonify({
            "success": False,
            "error": error or "Invalid username or password"
        }), 401
        
    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": data["token"],
        "user": data["user"]
    }), 200


@auth_bp.route("/admin/logout", methods=["POST"])
@admin_required
def admin_logout():
    """Admin logout endpoint (client removes token)."""
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200


@auth_bp.route("/admin/verify", methods=["GET"])
@admin_required
def verify_admin_session():
    """Verify currently authenticated admin token."""
    return jsonify({
        "success": True,
        "valid": True,
        "user": g.current_user
    }), 200


@auth_bp.route("/admin/profile", methods=["PUT"])
@admin_required
def change_password():
    """Update admin username or password."""
    payload = request.get_json(silent=True) or {}
    current_password = payload.get("current_password", "").strip()
    new_username = payload.get("new_username")
    new_password = payload.get("new_password")
    
    if not current_password:
        return jsonify({
            "success": False,
            "error": "Current password is required to make profile changes"
        }), 400
        
    success, msg = update_admin_profile(current_password, new_username, new_password)
    if not success:
        return jsonify({"success": False, "error": msg}), 400
        
    return jsonify({"success": True, "message": msg}), 200
