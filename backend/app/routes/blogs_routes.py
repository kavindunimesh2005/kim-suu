from flask import Blueprint, jsonify, request
from app.services.data_service import get_all, get_by_id, create_item, update_item, delete_item
from app.auth.auth_service import admin_required

blogs_bp = Blueprint('blogs', __name__)

@blogs_bp.route('', methods=['GET'])
def list_blogs():
    blogs = get_all('blogs')
    category = request.args.get('category')
    tag = request.args.get('tag')
    search = request.args.get('search', '').lower()
    status = request.args.get('status')
    
    filtered = blogs
    if status:
        filtered = [b for b in filtered if b.get('status') == status]
    if category and category != 'All':
        filtered = [b for b in filtered if b.get('category') == category]
    if tag:
        filtered = [b for b in filtered if tag in b.get('tags', [])]
    if search:
        filtered = [
            b for b in filtered
            if search in b.get('title_si', '').lower()
            or search in b.get('title_en', '').lower()
            or search in b.get('content_si', '').lower()
            or search in b.get('content_en', '').lower()
        ]
    return jsonify(filtered)

@blogs_bp.route('/<identifier>', methods=['GET'])
def get_blog(identifier):
    blog = get_by_id('blogs', identifier)
    if not blog:
        return jsonify({"error": "Blog post not found"}), 404
    return jsonify(blog)

@blogs_bp.route('', methods=['POST'])
@admin_required
def create_blog():
    data = request.get_json()
    if not data or not data.get('title_si') or not data.get('title_en'):
        return jsonify({"error": "Sinhala and English titles are required"}), 400
    if not data.get('slug'):
        data['slug'] = data.get('title_en').lower().replace(' ', '-').replace(':', '')
    new_blog = create_item('blogs', data)
    return jsonify(new_blog), 201

@blogs_bp.route('/<identifier>', methods=['PUT'])
@admin_required
def update_blog(identifier):
    data = request.get_json()
    updated = update_item('blogs', identifier, data)
    if not updated:
        return jsonify({"error": "Blog not found"}), 404
    return jsonify(updated)

@blogs_bp.route('/<identifier>', methods=['DELETE'])
@admin_required
def delete_blog(identifier):
    success = delete_item('blogs', identifier)
    if not success:
        return jsonify({"error": "Blog not found"}), 404
    return jsonify({"success": True, "message": "Blog deleted successfully"})
