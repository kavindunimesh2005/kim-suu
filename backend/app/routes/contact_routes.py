"""Contact form and admin message management routes."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import (
    get_all,
    get_by_id,
    create,
    update,
    delete
)
from backend.app.services.validation_service import validate_contact_message

contact_bp = Blueprint("contact", __name__)


# ==========================================
# Public Endpoints
# ==========================================

@contact_bp.route("/contact", methods=["POST"])
def submit_contact_message():
    """Public: submit a contact message / reader inquiry."""
    payload = request.get_json(silent=True) or {}
    is_valid, error = validate_contact_message(payload)
    if not is_valid:
        return jsonify({"success": False, "error": error}), 400
        
    message_data = {
        "name": str(payload.get("name", "")).strip(),
        "email": str(payload.get("email", "")).strip().lower(),
        "subject": str(payload.get("subject", "General Inquiry")).strip(),
        "message": str(payload.get("message", "")).strip(),
        "read": False
    }
    
    saved_message = create("messages", message_data)
    
    return jsonify({
        "success": True,
        "message": "Thank you for reaching out. Your message has been received.",
        "data": {
            "id": saved_message["id"],
            "created_at": saved_message["created_at"]
        }
    }), 201


# ==========================================
# Admin Endpoints
# ==========================================

@contact_bp.route("/admin/messages", methods=["GET"])
@contact_bp.route("/contact/admin/messages", methods=["GET"])
@admin_required
def admin_get_messages():
    """Admin: retrieve reader inquiries, optionally filtered by read status."""
    messages = get_all("messages")
    
    read_filter = request.args.get("read") or request.args.get("status")
    if read_filter is not None:
        target_read = read_filter.lower() in ("true", "1", "yes", "read")
        messages = [m for m in messages if bool(m.get("read")) is target_read]
        
    # Sort descending by creation date
    messages = sorted(
        messages,
        key=lambda m: m.get("created_at", ""),
        reverse=True
    )
    
    return jsonify({
        "success": True,
        "count": len(messages),
        "data": messages
    }), 200


@contact_bp.route("/admin/messages/<message_id>/read", methods=["PUT"])
@contact_bp.route("/contact/admin/messages/<message_id>/read", methods=["PUT"])
@contact_bp.route("/contact/admin/messages/<message_id>", methods=["PUT"])
@admin_required
def admin_mark_message_read(message_id: str):
    """Admin: mark a message as read or unread."""
    message = get_by_id("messages", message_id)
    if not message:
        return jsonify({"success": False, "error": f"Message '{message_id}' not found"}), 404
        
    payload = request.get_json(silent=True) or {}
    if "status" in payload:
        new_state = payload["status"] == "read"
    else:
        new_state = payload.get("read", True)
    
    updated = update("messages", message_id, {"read": bool(new_state)})
    return jsonify({
        "success": True,
        "message": f"Message marked as {'read' if new_state else 'unread'}",
        "data": updated
    }), 200


@contact_bp.route("/admin/messages/<message_id>", methods=["DELETE"])
@contact_bp.route("/contact/admin/messages/<message_id>", methods=["DELETE"])
@admin_required
def admin_delete_message(message_id: str):
    """Admin: delete a message."""
    success = delete("messages", message_id)
    if not success:
        return jsonify({"success": False, "error": f"Message '{message_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Message deleted successfully"
    }), 200
