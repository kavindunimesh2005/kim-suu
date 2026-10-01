import os
import uuid
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from app.auth.auth_service import admin_required

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('', methods=['POST'])
@admin_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_name = f"{uuid.uuid4().hex[:12]}.{ext}"
        try:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            save_path = os.path.join(UPLOAD_FOLDER, unique_name)
            file.save(save_path)
        except OSError:
            import tempfile
            tmp_upload = os.path.join(tempfile.gettempdir(), 'uploads')
            os.makedirs(tmp_upload, exist_ok=True)
            save_path = os.path.join(tmp_upload, unique_name)
            file.save(save_path)
        
        # Also copy to frontend public/assets if available so Vite dev server can also serve it directly
        frontend_assets = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '..', 'frontend', 'public', 'uploads')
        try:
            os.makedirs(frontend_assets, exist_ok=True)
            import shutil
            shutil.copy2(save_path, os.path.join(frontend_assets, unique_name))
        except Exception:
            pass
            
        file_url = f"/uploads/{unique_name}"
        return jsonify({
            "success": True,
            "url": file_url,
            "filename": unique_name
        }), 201
        
    return jsonify({"error": "File type not allowed. Supported: png, jpg, jpeg, webp, gif"}), 400

@upload_bp.route('/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    clean_name = secure_filename(filename)
    import tempfile
    tmp_upload = os.path.join(tempfile.gettempdir(), 'uploads')
    frontend_uploads = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '..', 'frontend', 'public', 'uploads')
    
    if os.path.exists(os.path.join(UPLOAD_FOLDER, clean_name)):
        return send_from_directory(UPLOAD_FOLDER, clean_name)
    elif os.path.exists(os.path.join(tmp_upload, clean_name)):
        return send_from_directory(tmp_upload, clean_name)
    elif os.path.exists(os.path.join(frontend_uploads, clean_name)):
        return send_from_directory(frontend_uploads, clean_name)
    return jsonify({"error": "File not found"}), 404
