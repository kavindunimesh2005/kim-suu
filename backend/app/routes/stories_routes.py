"""Stories and Poems routes (public and admin)."""
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import (
    get_all,
    get_by_id,
    create,
    update,
    delete
)
from backend.app.services.validation_service import validate_story_payload

stories_bp = Blueprint("stories", __name__)


# ==========================================
# Public Endpoints
# ==========================================

@stories_bp.route("/stories", methods=["GET"])
def get_public_stories():
    """Retrieve published stories and poems, optionally filtered by category."""
    stories = get_all("stories", filter_published=True)
    
    category = request.args.get("category", "").strip().lower()
    if category:
        stories = [
            s for s in stories
            if s.get("category", "").lower() == category or s.get("category_si", "").lower() == category
        ]
        
    stories = sorted(
        stories,
        key=lambda s: s.get("date") or s.get("created_at", ""),
        reverse=True
    )
    
    return jsonify({
        "success": True,
        "count": len(stories),
        "data": stories
    }), 200


@stories_bp.route("/stories/<story_id>", methods=["GET"])
def get_story_by_id(story_id: str):
    """Retrieve single published story by ID."""
    story = get_by_id("stories", story_id, filter_published=True)
    if not story:
        return jsonify({
            "success": False,
            "error": "Story not found or is currently unpublished"
        }), 404
        
    return jsonify({
        "success": True,
        "data": story
    }), 200


# ==========================================
# Admin Endpoints
# ==========================================

@stories_bp.route("/admin/stories", methods=["GET"])
@admin_required
def admin_get_all_stories():
    """Admin: retrieve all stories including drafts."""
    stories = get_all("stories", filter_published=False)
    stories = sorted(
        stories,
        key=lambda s: s.get("date") or s.get("created_at", ""),
        reverse=True
    )
    return jsonify({
        "success": True,
        "count": len(stories),
        "data": stories
    }), 200


@stories_bp.route("/admin/stories", methods=["POST"])
@stories_bp.route("/stories", methods=["POST"])
@admin_required
def admin_create_story():
    """Admin: create a new story."""
    payload = request.get_json(silent=True) or {}
    is_valid, error = validate_story_payload(payload)
    if not is_valid:
        return jsonify({"success": False, "error": error}), 400
        
    new_story = create("stories", payload)
    return jsonify({
        "success": True,
        "message": "Story created successfully",
        "data": new_story
    }), 201


@stories_bp.route("/admin/stories/<story_id>", methods=["PUT"])
@stories_bp.route("/stories/<story_id>", methods=["PUT"])
@admin_required
def admin_update_story(story_id: str):
    """Admin: update an existing story."""
    payload = request.get_json(silent=True) or {}
    updated = update("stories", story_id, payload)
    if not updated:
        return jsonify({"success": False, "error": f"Story '{story_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Story updated successfully",
        "data": updated
    }), 200


@stories_bp.route("/admin/stories/<story_id>", methods=["DELETE"])
@stories_bp.route("/stories/<story_id>", methods=["DELETE"])
@admin_required
def admin_delete_story(story_id: str):
    """Admin: delete a story."""
    success = delete("stories", story_id)
    if not success:
        return jsonify({"success": False, "error": f"Story '{story_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Story deleted successfully"
    }), 200


@stories_bp.route("/admin/stories/<story_id>/publish", methods=["PATCH"])
@admin_required
def admin_toggle_publish_story(story_id: str):
    """Admin: toggle or set published state."""
    story = get_by_id("stories", story_id)
    if not story:
        return jsonify({"success": False, "error": f"Story '{story_id}' not found"}), 404
        
    payload = request.get_json(silent=True) or {}
    if "published" in payload:
        new_state = bool(payload["published"])
    else:
        new_state = not story.get("published", False)
        
    updated = update("stories", story_id, {"published": new_state})
    return jsonify({
        "success": True,
        "message": f"Story publish status updated to {new_state}",
        "data": updated
    }), 200
