"""Health check route."""
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "success": True,
        "message": "Suchetha Kapuarachchi Author Portfolio API is operational",
        "status": "healthy",
        "version": "1.0.0"
    }), 200
