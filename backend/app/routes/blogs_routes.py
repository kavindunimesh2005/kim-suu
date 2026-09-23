"""Blogs routes (public and admin)."""
import math
from flask import Blueprint, request, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import (
    get_all,
    get_by_id,
    get_by_slug,
    create,
    update,
    delete
)
from backend.app.services.validation_service import validate_blog_payload

blogs_bp = Blueprint("blogs", __name__)


# ==========================================
# Public Endpoints
# ==========================================

@blogs_bp.route("/blogs", methods=["GET"])
def get_public_blogs():
    """Retrieve published blogs with filtering, search, and pagination."""
    blogs = get_all("blogs", filter_published=True)
    
    # 1. Filter by category
    category = request.args.get("category", "").strip().lower()
    if category:
        blogs = [
            b for b in blogs
            if b.get("category", "").lower() == category or b.get("category_si", "").lower() == category
        ]
        
    # 2. Filter by tag
    tag = request.args.get("tag", "").strip().lower()
    if tag:
        blogs = [
            b for b in blogs
            if any(tag == t.lower() for t in b.get("tags", []))
        ]
        
    # 3. Full-text search
    search = request.args.get("search", "").strip().lower()
    if search:
        blogs = [
            b for b in blogs
            if (
                search in b.get("title_en", "").lower()
                or search in b.get("title_si", "").lower()
                or search in b.get("excerpt_en", "").lower()
                or search in b.get("excerpt_si", "").lower()
                or search in b.get("content_en", "").lower()
                or search in b.get("content_si", "").lower()
                or any(search in t.lower() for t in b.get("tags", []))
            )
        ]
        
    # Sort by date / created_at descending
    blogs = sorted(
        blogs,
        key=lambda b: b.get("date") or b.get("created_at", ""),
        reverse=True
    )
    
    total = len(blogs)
    
    # 4. Pagination
    try:
        page = max(1, int(request.args.get("page", 1)))
    except (ValueError, TypeError):
        page = 1
        
    try:
        limit = int(request.args.get("limit", 10))
    except (ValueError, TypeError):
        limit = 10
        
    if limit > 0:
        total_pages = math.ceil(total / limit) if total > 0 else 1
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_blogs = blogs[start_idx:end_idx]
    else:
        total_pages = 1
        paginated_blogs = blogs
        
    return jsonify({
        "success": True,
        "total": total,
        "count": len(paginated_blogs),
        "page": page,
        "total_pages": total_pages,
        "data": paginated_blogs
    }), 200


@blogs_bp.route("/blogs/<identifier>", methods=["GET"])
def get_blog_by_id_or_slug(identifier: str):
    """Retrieve single published blog post by ID or slug."""
    blog = get_by_id("blogs", identifier, filter_published=True)
    if not blog:
        blog = get_by_slug("blogs", identifier, filter_published=True)
        
    if not blog:
        return jsonify({
            "success": False,
            "error": "Blog post not found or is currently unpublished"
        }), 404
        
    return jsonify({
        "success": True,
        "data": blog
    }), 200


@blogs_bp.route("/blogs/slug/<slug>", methods=["GET"])
def get_blog_by_slug(slug: str):
    """Retrieve single published blog post by slug."""
    blog = get_by_slug("blogs", slug, filter_published=True)
    if not blog:
        return jsonify({
            "success": False,
            "error": "Blog post not found"
        }), 404
        
    return jsonify({
        "success": True,
        "data": blog
    }), 200


# ==========================================
# Admin Endpoints
# ==========================================

@blogs_bp.route("/admin/blogs", methods=["GET"])
@admin_required
def admin_get_all_blogs():
    """Admin: retrieve all blogs including drafts."""
    blogs = get_all("blogs", filter_published=False)
    # Sort descending
    blogs = sorted(
        blogs,
        key=lambda b: b.get("date") or b.get("created_at", ""),
        reverse=True
    )
    return jsonify({
        "success": True,
        "count": len(blogs),
        "data": blogs
    }), 200


@blogs_bp.route("/admin/blogs", methods=["POST"])
@blogs_bp.route("/blogs", methods=["POST"])
@admin_required
def admin_create_blog():
    """Admin: create a new blog post."""
    payload = request.get_json(silent=True) or {}
    is_valid, error = validate_blog_payload(payload)
    if not is_valid:
        return jsonify({"success": False, "error": error}), 400
        
    new_blog = create("blogs", payload)
    return jsonify({
        "success": True,
        "message": "Blog post created successfully",
        "data": new_blog
    }), 201


@blogs_bp.route("/admin/blogs/<blog_id>", methods=["PUT"])
@blogs_bp.route("/blogs/<blog_id>", methods=["PUT"])
@admin_required
def admin_update_blog(blog_id: str):
    """Admin: update an existing blog post."""
    payload = request.get_json(silent=True) or {}
    updated = update("blogs", blog_id, payload)
    if not updated:
        return jsonify({"success": False, "error": f"Blog '{blog_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Blog post updated successfully",
        "data": updated
    }), 200


@blogs_bp.route("/admin/blogs/<blog_id>", methods=["DELETE"])
@blogs_bp.route("/blogs/<blog_id>", methods=["DELETE"])
@admin_required
def admin_delete_blog(blog_id: str):
    """Admin: delete a blog post."""
    success = delete("blogs", blog_id)
    if not success:
        return jsonify({"success": False, "error": f"Blog '{blog_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Blog post deleted successfully"
    }), 200


@blogs_bp.route("/admin/blogs/<blog_id>/publish", methods=["PATCH"])
@admin_required
def admin_toggle_publish_blog(blog_id: str):
    """Admin: toggle or set published state."""
    blog = get_by_id("blogs", blog_id)
    if not blog:
        return jsonify({"success": False, "error": f"Blog '{blog_id}' not found"}), 404
        
    payload = request.get_json(silent=True) or {}
    if "published" in payload:
        new_state = bool(payload["published"])
    else:
        new_state = not blog.get("published", False)
        
    updated = update("blogs", blog_id, {"published": new_state})
    return jsonify({
        "success": True,
        "message": f"Blog publish status updated to {new_state}",
        "data": updated
    }), 200
