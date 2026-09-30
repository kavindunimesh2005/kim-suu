import hmac
import hashlib
import time
import base64
import os
from functools import wraps
from flask import request, jsonify
from werkzeug.security import check_password_hash
from app.services.data_service import get_single

SECRET_KEY = os.environ.get('SECRET_KEY', 'suchetha-kapuarachchi-secret-key-2026').encode('utf-8')
SESSION_EXPIRY_SECONDS = 86400 * 7  # 7 days

def _generate_signature(data_str):
    return hmac.new(SECRET_KEY, data_str.encode('utf-8'), hashlib.sha256).hexdigest()

def authenticate_admin(username, password):
    admin_data = get_single('admin')
    admin_info = admin_data.get('admin', {})
    
    stored_username = admin_info.get('username', 'Kavii')
    stored_hash = admin_info.get('password_hash')
    
    if not stored_hash:
        return None, "Admin not configured"
        
    allowed_usernames = [stored_username.strip().lower(), 'admin']
    if username.strip().lower() not in allowed_usernames:
        return None, "Invalid username or password"
        
    if not check_password_hash(stored_hash, password.strip()):
        return None, "Invalid username or password"
        
    # Generate stateless HMAC token
    expires_at = int(time.time() + SESSION_EXPIRY_SECONDS)
    payload = f"{stored_username}:{expires_at}"
    sig = _generate_signature(payload)
    token = base64.urlsafe_b64encode(f"{payload}:{sig}".encode('utf-8')).decode('utf-8')
    
    return {
        "token": token,
        "username": stored_username,
        "name": admin_info.get("name", "Admin"),
        "role": admin_info.get("role", "admin"),
        "expires_in": SESSION_EXPIRY_SECONDS
    }, None

def verify_token(token):
    if not token:
        return False, None
    try:
        decoded = base64.urlsafe_b64decode(token.encode('utf-8')).decode('utf-8')
        parts = decoded.split(':')
        if len(parts) != 3:
            return False, None
            
        username, expires_at_str, sig = parts
        expires_at = int(expires_at_str)
        
        if time.time() > expires_at:
            return False, None
            
        payload = f"{username}:{expires_at}"
        expected_sig = _generate_signature(payload)
        if not hmac.compare_digest(sig, expected_sig):
            return False, None
            
        admin_data = get_single('admin')
        admin_info = admin_data.get('admin', {})
        
        return True, {
            "username": username,
            "name": admin_info.get("name", "Admin"),
            "role": admin_info.get("role", "admin"),
            "expires_at": expires_at
        }
    except Exception:
        return False, None

def invalidate_token(token):
    # In stateless model, client discards token on logout
    return True

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
            return jsonify({"error": "Unauthorized", "message": "Invalid or expired session token. Please log in again."}), 401
            
        request.admin_user = session_data
        return f(*args, **kwargs)
    return decorated_function
