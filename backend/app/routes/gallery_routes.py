from flask import Blueprint, jsonify, request
from app.services.data_service import get_all, get_by_id, create_item, update_item, delete_item
from app.auth.auth_service import admin_required

gallery_bp = Blueprint('gallery', __name__)

@gallery_bp.route('', methods=['GET'])
def list_gallery():
    items = get_all('gallery')
    category = request.args.get('category')
    status = request.args.get('status')
    
    filtered = items
    if status:
        filtered = [item for item in filtered if item.get('status') == status]
    if category and category != 'All':
        filtered = [item for item in filtered if item.get('category') == category]
        
    filtered.sort(key=lambda x: x.get('order', 999))
    return jsonify(filtered)

@gallery_bp.route('/<identifier>', methods=['GET'])
def get_gallery_item(identifier):
    item = get_by_id('gallery', identifier)
    if not item:
        return jsonify({"error": "Gallery item not found"}), 404
    return jsonify(item)

@gallery_bp.route('', methods=['POST'])
@admin_required
def create_gallery_item():
    data = request.get_json()
    if not data or not data.get('image'):
        return jsonify({"error": "Image path/URL is required"}), 400
    new_item = create_item('gallery', data)
    return jsonify(new_item), 201

@gallery_bp.route('/<identifier>', methods=['PUT'])
@admin_required
def update_gallery_item(identifier):
    data = request.get_json()
    updated = update_item('gallery', identifier, data)
    if not updated:
        return jsonify({"error": "Gallery item not found"}), 404
    return jsonify(updated)

@gallery_bp.route('/<identifier>', methods=['DELETE'])
@admin_required
def delete_gallery_item(identifier):
    success = delete_item('gallery', identifier)
    if not success:
        return jsonify({"error": "Gallery item not found"}), 404
    return jsonify({"success": True, "message": "Gallery item deleted successfully"})
