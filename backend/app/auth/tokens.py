"""JWT Token creation and verification module."""
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import jwt
from backend.app.config import Config


def generate_token(user_id: str, username: str, role: str = "admin") -> str:
    """Generate a signed JWT token."""
    now = datetime.now(timezone.utc)
    exp = now + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    
    payload = {
        "sub": str(user_id),
        "username": str(username),
        "role": str(role),
        "iat": now,
        "exp": exp
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    # In PyJWT 2+, jwt.encode returns a string
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def verify_token(token: str) -> Tuple[bool, Optional[dict], Optional[str]]:
    """
    Verify and decode a JWT token.
    
    Returns:
        (is_valid: bool, payload: Optional[dict], error_message: Optional[str])
    """
    if not token:
        return False, None, "Token is required"
        
    try:
        payload = jwt.decode(
            token,
            Config.JWT_SECRET_KEY,
            algorithms=[Config.JWT_ALGORITHM]
        )
        return True, payload, None
    except jwt.ExpiredSignatureError:
        return False, None, "Token has expired"
    except jwt.InvalidTokenError as e:
        return False, None, f"Invalid token: {str(e)}"
    except Exception as e:
        return False, None, f"Token verification error: {str(e)}"
