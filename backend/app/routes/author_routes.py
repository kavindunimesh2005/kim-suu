from flask import Blueprint, jsonify, request
from app.services.data_service import get_single, update_single
from app.auth.auth_service import admin_required

author_bp = Blueprint('author', __name__)

@author_bp.route('', methods=['GET'])
def get_author_profile():
    profile = get_single('author')
    return jsonify(profile)

@author_bp.route('', methods=['PUT'])
@admin_required
def update_author_profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    updated = update_single('author', data)
    return jsonify(updated)
