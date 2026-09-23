"""Upload service with Pillow verification and secure UUID storage."""
import os
import uuid
from pathlib import Path
from PIL import Image
from werkzeug.utils import secure_filename
from backend.app.config import Config


def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed."""
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS


def validate_and_save_image(file_storage, category: str = "general") -> dict:
    """
    Validate image file using Pillow, generate secure UUID filename, and save.
    
    Args:
        file_storage: Werkzeug FileStorage object.
        category: Subfolder name ('books', 'blogs', 'stories', 'gallery', 'author').
        
    Returns:
        dict with success status, url, filename, size, dimensions, format or error message.
    """
    if not file_storage or not file_storage.filename:
        return {"success": False, "error": "No file uploaded or filename is empty"}
        
    original_filename = secure_filename(file_storage.filename)
    if not is_allowed_file(original_filename):
        return {
            "success": False,
            "error": f"Invalid file extension. Allowed extensions: {', '.join(Config.ALLOWED_EXTENSIONS)}"
        }
        
    # Validate category
    category = category.lower().strip()
    if category not in Config.ALLOWED_UPLOAD_CATEGORIES:
        category = "general"
        
    dest_dir = Config.UPLOAD_FOLDER / category
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Verify image integrity via Pillow
    try:
        # Read stream and check with Pillow
        image = Image.open(file_storage.stream)
        image.verify()  # Verifies file header and structure
        
        # Reset stream pointer after verify()
        file_storage.stream.seek(0)
        
        # Re-open to extract dimensions and format
        image = Image.open(file_storage.stream)
        width, height = image.size
        img_format = image.format.lower() if image.format else "unknown"
        file_storage.stream.seek(0)
    except Exception as e:
        return {"success": False, "error": f"Invalid or corrupted image file: {str(e)}"}
        
    # Generate unique filename
    ext = original_filename.rsplit(".", 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    target_path = dest_dir / unique_filename
    
    try:
        file_storage.save(str(target_path))
        file_size = target_path.stat().st_size
    except Exception as e:
        return {"success": False, "error": f"Failed to save file: {str(e)}"}
        
    relative_url = f"/uploads/{category}/{unique_filename}"
    
    return {
        "success": True,
        "url": relative_url,
        "filename": unique_filename,
        "category": category,
        "width": width,
        "height": height,
        "format": img_format,
        "size_bytes": file_size
    }
