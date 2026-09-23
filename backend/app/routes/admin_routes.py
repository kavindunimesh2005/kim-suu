"""Admin dashboard and management routes."""
from flask import Blueprint, jsonify
from backend.app.auth.decorators import admin_required
from backend.app.services.data_service import get_all

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/dashboard", methods=["GET"])
@admin_required
def get_dashboard_stats():
    """Return live aggregate statistics across all portfolio collections."""
    books = get_all("books")
    blogs = get_all("blogs")
    stories = get_all("stories")
    gallery = get_all("gallery")
    messages = get_all("messages")
    
    books_published = sum(1 for b in books if b.get("published") is True or str(b.get("status", "")).lower() == "published")
    blogs_published = sum(1 for b in blogs if b.get("published") is True or str(b.get("status", "")).lower() == "published")
    stories_published = sum(1 for s in stories if s.get("published") is True or str(s.get("status", "")).lower() == "published")
    gallery_published = sum(1 for g in gallery if g.get("published") is True or str(g.get("status", "")).lower() == "published")
    unread_messages = sum(1 for m in messages if not m.get("read", False))
    
    # Sort messages by created_at descending, take latest 5
    sorted_messages = sorted(
        messages,
        key=lambda m: m.get("created_at", ""),
        reverse=True
    )[:5]
    
    return jsonify({
        "success": True,
        "counts": {
            "books": {
                "total": len(books),
                "published": books_published,
                "drafts": len(books) - books_published
            },
            "blogs": {
                "total": len(blogs),
                "published": blogs_published,
                "drafts": len(blogs) - blogs_published
            },
            "stories": {
                "total": len(stories),
                "published": stories_published,
                "drafts": len(stories) - stories_published
            },
            "gallery": {
                "total": len(gallery),
                "published": gallery_published,
                "drafts": len(gallery) - gallery_published
            },
            "messages": {
                "total": len(messages),
                "unread": unread_messages,
                "read": len(messages) - unread_messages
            }
        },
        "stats": {
            "total_books": len(books),
            "published_books": books_published,
            "draft_books": len(books) - books_published,
            "total_blogs": len(blogs),
            "published_blogs": blogs_published,
            "draft_blogs": len(blogs) - blogs_published,
            "total_stories": len(stories),
            "published_stories": stories_published,
            "draft_stories": len(stories) - stories_published,
            "total_gallery": len(gallery),
            "published_gallery": gallery_published,
            "draft_gallery": len(gallery) - gallery_published,
            "total_messages": len(messages),
            "unread_messages": unread_messages,
            "read_messages": len(messages) - unread_messages
        },
        "recent_messages": sorted_messages
    }), 200
