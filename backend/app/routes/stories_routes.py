from flask import Blueprint, jsonify, request
from app.services.data_service import get_all, get_by_id, create_item, update_item, delete_item
from app.auth.auth_service import admin_required

stories_bp = Blueprint('stories', __name__)

@stories_bp.route('', methods=['GET'])
def list_stories():
    stories = get_all('stories')
    category = request.args.get('category')
    status = request.args.get('status')
    
    filtered = stories
    if status:
        filtered = [s for s in filtered if s.get('status') == status]
    if category and category != 'All':
        filtered = [s for s in filtered if s.get('category') == category]
    return jsonify(filtered)

@stories_bp.route('/<identifier>', methods=['GET'])
def get_story(identifier):
    story = get_by_id('stories', identifier)
    if not story:
        return jsonify({"error": "Story not found"}), 404
    return jsonify(story)

@stories_bp.route('', methods=['POST'])
@admin_required
def create_story():
    data = request.get_json()
    if not data or not data.get('title_si') or not data.get('content_si'):
        return jsonify({"error": "Sinhala title and content are required"}), 400
    new_story = create_item('stories', data)
    return jsonify(new_story), 201

@stories_bp.route('/<identifier>', methods=['PUT'])
@admin_required
def update_story(identifier):
    data = request.get_json()
    updated = update_item('stories', identifier, data)
    if not updated:
        return jsonify({"error": "Story not found"}), 404
    return jsonify(updated)

@stories_bp.route('/<identifier>', methods=['DELETE'])
@admin_required
def delete_story(identifier):
    success = delete_item('stories', identifier)
    if not success:
        return jsonify({"error": "Story not found"}), 404
    return jsonify({"success": True, "message": "Story deleted successfully"})
