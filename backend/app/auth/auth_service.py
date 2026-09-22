import secrets
import time
from functools import wraps
from flask import request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.services.data_service import get_single, update_single

# Active session tokens dictionary {token: {"username": ..., "expires_at": ...}}
ACTIVE_SESSIONS = {}
SESSION_EXPIRY_SECONDS = 86400  # 24 hours

def authenticate_admin(username, password):
    admin_data = get_single('admin')
    admin_info = admin_data.get('admin', {})
    
    stored_username = admin_info.get('username')
    stored_hash = admin_info.get('password_hash')
    
    if not stored_username or not stored_hash:
        return None, "Admin not configured"
        
    if username != stored_username:
        return None, "Invalid username or password"
        
    if not check_password_hash(stored_hash, password):
        return None, "Invalid username or password"
        
    # Generate secure token
    token = secrets.token_urlsafe(32)
    expires_at = time.time() + SESSION_EXPIRY_SECONDS
    ACTIVE_SESSIONS[token] = {
        "username": stored_username,
        "name": admin_info.get("name", "Admin"),
        "role": admin_info.get("role", "admin"),
        "expires_at": expires_at
    }
    
    return {
        "token": token,
        "username": stored_username,
        "name": admin_info.get("name", "Admin"),
        "role": admin_info.get("role", "admin"),
        "expires_in": SESSION_EXPIRY_SECONDS
    }, None

def verify_token(token):
    if not token or token not in ACTIVE_SESSIONS:
        return False, None
    session_data = ACTIVE_SESSIONS[token]
    if time.time() > session_data["expires_at"]:
        del ACTIVE_SESSIONS[token]
        return False, None
    return True, session_data

def invalidate_token(token):
    if token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
        return True
    return False

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1].strip()
        elif 'X-Admin-Token' in request.headers:
            token = request.headers['X-Admin-Token']
            
        if not token:
            return jsonify({"error": "Unauthorized", "message": "Authentication token required"}), 401
            
        valid, session_data = verify_token(token)
        if not valid:
            return jsonify({"error": "Unauthorized", "message": "Invalid or expired token"}), 401
            
        request.admin_user = session_data
        return f(*args, **kwargs)
    return decorated_function
