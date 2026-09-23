"""Gallery items routes (public and admin)."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import (
    get_all,
    get_by_id,
    create,
    update,
    delete
)
from backend.app.services.validation_service import validate_gallery_payload

gallery_bp = Blueprint("gallery", __name__)


# ==========================================
# Public Endpoints
# ==========================================

@gallery_bp.route("/gallery", methods=["GET"])
def get_public_gallery():
    """Retrieve published gallery items, optionally filtered by category."""
    items = get_all("gallery", filter_published=True)
    
    category = request.args.get("category", "").strip().lower()
    if category:
        items = [
            g for g in items
            if g.get("category", "").lower() == category or g.get("category_si", "").lower() == category
        ]
        
    show_in_blog = request.args.get("showInBlog", "").strip().lower()
    if show_in_blog in ("true", "1"):
        items = [g for g in items if g.get("showInBlog") is True or g.get("show_in_blog") is True]

    limit = request.args.get("limit", "").strip()
    if limit.isdigit():
        items = items[:int(limit)]

    return jsonify({
        "success": True,
        "count": len(items),
        "data": items
    }), 200


@gallery_bp.route("/gallery/<item_id>", methods=["GET"])
def get_gallery_item_by_id(item_id: str):
    """Retrieve single published gallery item by ID."""
    item = get_by_id("gallery", item_id, filter_published=True)
    if not item:
        return jsonify({
            "success": False,
            "error": "Gallery item not found or is currently unpublished"
        }), 404
        
    return jsonify({
        "success": True,
        "data": item
    }), 200


# ==========================================
# Admin Endpoints
# ==========================================

@gallery_bp.route("/admin/gallery", methods=["GET"])
@admin_required
def admin_get_all_gallery():
    """Admin: retrieve all gallery items including drafts."""
    items = get_all("gallery", filter_published=False)
    return jsonify({
        "success": True,
        "count": len(items),
        "data": items
    }), 200


@gallery_bp.route("/admin/gallery", methods=["POST"])
@gallery_bp.route("/gallery", methods=["POST"])
@admin_required
def admin_create_gallery_item():
    """Admin: create a new gallery item."""
    payload = request.get_json(silent=True) or {}
    is_valid, error = validate_gallery_payload(payload)
    if not is_valid:
        return jsonify({"success": False, "error": error}), 400
        
    new_item = create("gallery", payload)
    return jsonify({
        "success": True,
        "message": "Gallery item created successfully",
        "data": new_item
    }), 201


@gallery_bp.route("/admin/gallery/<item_id>", methods=["PUT"])
@gallery_bp.route("/gallery/<item_id>", methods=["PUT"])
@admin_required
def admin_update_gallery_item(item_id: str):
    """Admin: update an existing gallery item."""
    payload = request.get_json(silent=True) or {}
    updated = update("gallery", item_id, payload)
    if not updated:
        return jsonify({"success": False, "error": f"Gallery item '{item_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Gallery item updated successfully",
        "data": updated
    }), 200


@gallery_bp.route("/admin/gallery/<item_id>", methods=["DELETE"])
@gallery_bp.route("/gallery/<item_id>", methods=["DELETE"])
@admin_required
def admin_delete_gallery_item(item_id: str):
    """Admin: delete a gallery item."""
    success = delete("gallery", item_id)
    if not success:
        return jsonify({"success": False, "error": f"Gallery item '{item_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Gallery item deleted successfully"
    }), 200


@gallery_bp.route("/admin/gallery/<item_id>/publish", methods=["PATCH"])
@admin_required
def admin_toggle_publish_gallery(item_id: str):
    """Admin: toggle or set published state."""
    item = get_by_id("gallery", item_id)
    if not item:
        return jsonify({"success": False, "error": f"Gallery item '{item_id}' not found"}), 404
        
    payload = request.get_json(silent=True) or {}
    if "published" in payload:
        new_state = bool(payload["published"])
    else:
        new_state = not item.get("published", False)
        
    updated = update("gallery", item_id, {"published": new_state})
    return jsonify({
        "success": True,
        "message": f"Gallery item publish status updated to {new_state}",
        "data": updated
    }), 200
