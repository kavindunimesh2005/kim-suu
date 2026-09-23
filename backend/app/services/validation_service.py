"""Input validation and sanitization service."""
import re
from typing import Dict, List, Optional, Tuple

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)


def validate_email(email: str) -> bool:
    """Validate email address format."""
    if not email or not isinstance(email, str):
        return False
    email = email.strip()
    if len(email) > 254:
        return False
    return bool(EMAIL_REGEX.match(email))


def validate_required_fields(data: dict, required_fields: List[str]) -> List[str]:
    """Return list of missing or empty required fields."""
    if not isinstance(data, dict):
        return required_fields
        
    missing = []
    for field in required_fields:
        val = data.get(field)
        if val is None or (isinstance(val, str) and not val.strip()):
            missing.append(field)
    return missing


def validate_contact_message(data: dict) -> Tuple[bool, Optional[str]]:
    """Validate contact form submission payload."""
    required = ["name", "email", "message"]
    missing = validate_required_fields(data, required)
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
        
    if not validate_email(data.get("email", "")):
        return False, "Invalid email address format"
        
    name = str(data.get("name", "")).strip()
    if len(name) < 2 or len(name) > 100:
        return False, "Name must be between 2 and 100 characters"
        
    message = str(data.get("message", "")).strip()
    if len(message) < 5 or len(message) > 5000:
        return False, "Message must be between 5 and 5000 characters"
        
    return True, None


def validate_book_payload(data: dict) -> Tuple[bool, Optional[str]]:
    """Validate book payload."""
    if not data.get("title_si") and not data.get("title_en"):
        return False, "Either title_si or title_en must be provided"
    return True, None


def validate_blog_payload(data: dict) -> Tuple[bool, Optional[str]]:
    """Validate blog post payload."""
    if not data.get("title_si") and not data.get("title_en"):
        return False, "Either title_si or title_en must be provided"
    if not data.get("content_si") and not data.get("content_en"):
        return False, "Either content_si or content_en must be provided"
    return True, None


def validate_story_payload(data: dict) -> Tuple[bool, Optional[str]]:
    """Validate story payload."""
    if not data.get("title_si") and not data.get("title_en"):
        return False, "Either title_si or title_en must be provided"
    if not data.get("content_si") and not data.get("content_en"):
        return False, "Either content_si or content_en must be provided"
    return True, None


def validate_gallery_payload(data: dict) -> Tuple[bool, Optional[str]]:
    """Validate gallery payload."""
    if not data.get("image"):
        return False, "Image path or URL is required"
    return True, None
