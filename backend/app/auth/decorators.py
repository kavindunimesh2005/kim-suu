"""Authentication decorators for route protection."""
from functools import wraps
from flask import request, jsonify, g
from backend.app.auth.tokens import verify_token


def admin_required(f):
    """Decorator to require valid Admin JWT token in Authorization header."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        
        if not auth_header:
            return jsonify({
                "success": False,
                "error": "Authorization header is missing",
                "code": "AUTH_HEADER_MISSING"
            }), 401
            
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({
                "success": False,
                "error": "Authorization header must follow 'Bearer <token>' format",
                "code": "AUTH_FORMAT_INVALID"
            }), 401
            
        token = parts[1]
        is_valid, payload, error_msg = verify_token(token)
        
        if not is_valid or not payload:
            return jsonify({
                "success": False,
                "error": error_msg or "Invalid or expired token",
                "code": "AUTH_TOKEN_INVALID"
            }), 401
            
        # Store decoded payload on Flask g context
        g.current_user = payload
        return f(*args, **kwargs)
        
    return decorated_function
