"""Author profile routes (public and admin)."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import get_single, update_single

author_bp = Blueprint("author", __name__)


@author_bp.route("/author", methods=["GET"])
def get_author_profile():
    """Public: retrieve author bio, philosophy, achievements and contact information."""
    author = get_single("author")
    return jsonify({
        "success": True,
        "data": author
    }), 200


@author_bp.route("/admin/author", methods=["PUT"])
@author_bp.route("/author", methods=["PUT"])
@admin_required
def admin_update_author_profile():
    """Admin: update author information and bio."""
    payload = request.get_json(silent=True) or {}
    if not payload:
        return jsonify({"success": False, "error": "No update data provided"}), 400
        
    updated = update_single("author", payload)
    return jsonify({
        "success": True,
        "message": "Author profile updated successfully",
        "data": updated
    }), 200
