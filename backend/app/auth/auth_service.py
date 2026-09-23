"""Authentication service handling admin login and credential verification."""
from datetime import datetime, timezone
from typing import Tuple, Optional, Dict, Any
from werkzeug.security import check_password_hash, generate_password_hash
from backend.app.services.data_service import get_single, update_single
from backend.app.auth.tokens import generate_token


def authenticate_admin(username: str, password: str) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    """
    Authenticate admin credentials against admin.json.
    
    Returns:
        (success: bool, auth_data: Optional[dict], error: Optional[str])
    """
    if not username or not password:
        return False, None, "Username and password are required"
        
    admin_data = get_single("admin")
    if isinstance(admin_data, dict) and "admin" in admin_data and isinstance(admin_data["admin"], dict):
        admin_data = admin_data["admin"]
        
    if not admin_data or "password_hash" not in admin_data:
        return False, None, "Admin account not properly configured"
        
    stored_username = admin_data.get("username", "")
    if username.strip().lower() != stored_username.strip().lower():
        return False, None, "Invalid username or password"
        
    if not check_password_hash(admin_data["password_hash"], password):
        return False, None, "Invalid username or password"
        
    # Successful authentication
    admin_id = admin_data.get("id", "admin-1")
    token = generate_token(
        user_id=admin_id,
        username=stored_username,
        role=admin_data.get("role", "admin")
    )
    
    # Update last login timestamp
    update_single("admin", {
        "last_login": datetime.now(timezone.utc).isoformat()
    })
    
    user_info = {
        "id": admin_id,
        "username": stored_username,
        "name": admin_data.get("name", "Admin"),
        "role": admin_data.get("role", "admin")
    }
    
    return True, {"token": token, "user": user_info}, None


def update_admin_profile(current_password: str, new_username: Optional[str] = None, new_password: Optional[str] = None) -> Tuple[bool, Optional[str]]:
    """Change admin username or password after verifying current password."""
    admin_data = get_single("admin")
    if not check_password_hash(admin_data.get("password_hash", ""), current_password):
        return False, "Current password is incorrect"
        
    updates = {}
    if new_username and new_username.strip():
        updates["username"] = new_username.strip()
    if new_password and len(new_password) >= 6:
        updates["password_hash"] = generate_password_hash(new_password, method="scrypt")
        
    if updates:
        update_single("admin", updates)
        return True, "Profile updated successfully"
    return False, "No valid updates provided"
