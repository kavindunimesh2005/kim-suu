from flask import Blueprint, jsonify, request
from app.auth.auth_service import authenticate_admin, verify_token, invalidate_token, admin_required
from app.services.data_service import get_all, get_single

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing login credentials"}), 400
        
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    auth_result, error = authenticate_admin(username, password)
    if error:
        return jsonify({"error": error}), 401
        
    return jsonify({
        "success": True,
        "message": "Admin login successful",
        "auth": auth_result
    })

@admin_bp.route('/verify', methods=['GET'])
def admin_verify():
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ')[1].strip()
    elif 'X-Admin-Token' in request.headers:
        token = request.headers['X-Admin-Token']
        
    valid, user_data = verify_token(token)
    if not valid:
        return jsonify({"valid": False, "error": "Invalid or expired session"}), 401
        
    return jsonify({"valid": True, "user": user_data})

@admin_bp.route('/logout', methods=['POST'])
def admin_logout():
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ')[1].strip()
    elif 'X-Admin-Token' in request.headers:
        token = request.headers['X-Admin-Token']
        
    if token:
        invalidate_token(token)
    return jsonify({"success": True, "message": "Logged out successfully"})

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    books = get_all('books')
    blogs = get_all('blogs')
    stories = get_all('stories')
    gallery = get_all('gallery')
    messages = get_all('messages')
    
    total_books = len(books)
    published_books = sum(1 for b in books if b.get('status') == 'published')
    
    total_blogs = len(blogs)
    published_blogs = sum(1 for b in blogs if b.get('status') == 'published')
    draft_blogs = total_blogs - published_blogs
    
    total_stories = len(stories)
    total_gallery = len(gallery)
    
    total_messages = len(messages)
    new_messages = sum(1 for m in messages if m.get('status') == 'new')
    
    # Recent 5 messages
    sorted_messages = sorted(messages, key=lambda m: m.get('date', ''), reverse=True)
    recent_messages = sorted_messages[:5]
    
    return jsonify({
        "stats": {
            "total_books": total_books,
            "published_books": published_books,
            "total_blogs": total_blogs,
            "published_blogs": published_blogs,
            "draft_blogs": draft_blogs,
            "total_stories": total_stories,
            "total_gallery": total_gallery,
            "total_messages": total_messages,
            "new_messages": new_messages
        },
        "recent_messages": recent_messages,
        "books_summary": [{"id": b.get('id'), "title_si": b.get('title_si'), "title_en": b.get('title_en'), "status": b.get('status')} for b in books]
    })
