"""Website settings routes (public and admin)."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import get_single, update_single

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/settings", methods=["GET"])
def get_public_settings():
    """Public: retrieve website settings and active theme configurations."""
    settings = get_single("settings")
    return jsonify({
        "success": True,
        "data": settings
    }), 200


@settings_bp.route("/admin/settings", methods=["PUT"])
@settings_bp.route("/settings", methods=["PUT"])
@admin_required
def admin_update_settings():
    """Admin: update website settings, theme, contact info, and status."""
    payload = request.get_json(silent=True) or {}
    if not payload:
        return jsonify({"success": False, "error": "No update data provided"}), 400
        
    updated = update_single("settings", payload)
    return jsonify({
        "success": True,
        "message": "Website settings updated successfully",
        "data": updated
    }), 200
