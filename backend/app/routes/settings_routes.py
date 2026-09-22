from flask import Blueprint, jsonify, request
from app.services.data_service import get_single, update_single
from app.auth.auth_service import admin_required

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('', methods=['GET'])
def get_settings():
    settings = get_single('settings')
    return jsonify(settings)

@settings_bp.route('', methods=['PUT'])
@admin_required
def update_settings():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    updated = update_single('settings', data)
    return jsonify(updated)
