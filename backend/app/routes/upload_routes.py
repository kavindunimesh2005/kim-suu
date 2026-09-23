"""Image upload routes."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.upload_service import validate_and_save_image

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/admin/upload", methods=["POST"])
@upload_bp.route("/upload", methods=["POST"])
@admin_required
def admin_upload_image():
    """Admin: upload and validate image asset with Pillow."""
    file_storage = request.files.get("file") or request.files.get("image")
    if not file_storage or file_storage.filename == "":
        return jsonify({
            "success": False,
            "error": "No file part in request. Please upload using 'file' or 'image' field."
        }), 400
        
    category = request.form.get("category", "general")
    result = validate_and_save_image(file_storage, category=category)
    
    if not result.get("success"):
        return jsonify({
            "success": False,
            "error": result.get("error", "Failed to upload file")
        }), 400
        
    return jsonify({
        "success": True,
        "message": "Image uploaded successfully",
        "url": result.get("url"),
        "filename": result.get("filename"),
        "data": result
    }), 201
