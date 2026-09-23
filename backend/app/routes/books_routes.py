"""Books routes (public and admin)."""
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
from backend.app.services.validation_service import validate_book_payload

books_bp = Blueprint("books", __name__)


# ==========================================
# Public Endpoints
# ==========================================

@books_bp.route("/books", methods=["GET"])
def get_public_books():
    """Retrieve all published books."""
    books = get_all("books", filter_published=True)
    return jsonify({
        "success": True,
        "count": len(books),
        "data": books
    }), 200


@books_bp.route("/books/<identifier>", methods=["GET"])
def get_book_by_id_or_slug(identifier: str):
    """Retrieve a single published book by ID or slug."""
    book = get_by_id("books", identifier, filter_published=True)
    if not book:
        book = get_by_slug("books", identifier, filter_published=True)
        
    if not book:
        return jsonify({
            "success": False,
            "error": "Book not found or is currently unpublished"
        }), 404
        
    return jsonify({
        "success": True,
        "data": book
    }), 200


@books_bp.route("/books/slug/<slug>", methods=["GET"])
def get_book_by_slug(slug: str):
    """Retrieve a single published book by exact slug."""
    book = get_by_slug("books", slug, filter_published=True)
    if not book:
        return jsonify({
            "success": False,
            "error": "Book not found"
        }), 404
        
    return jsonify({
        "success": True,
        "data": book
    }), 200


# ==========================================
# Admin Endpoints
# ==========================================

@books_bp.route("/admin/books", methods=["GET"])
@admin_required
def admin_get_all_books():
    """Admin: retrieve all books including drafts."""
    books = get_all("books", filter_published=False)
    return jsonify({
        "success": True,
        "count": len(books),
        "data": books
    }), 200


@books_bp.route("/admin/books", methods=["POST"])
@books_bp.route("/books", methods=["POST"])
@admin_required
def admin_create_book():
    """Admin: create a new book entry."""
    payload = request.get_json(silent=True) or {}
    is_valid, error = validate_book_payload(payload)
    if not is_valid:
        return jsonify({"success": False, "error": error}), 400
        
    new_book = create("books", payload)
    return jsonify({
        "success": True,
        "message": "Book created successfully",
        "data": new_book
    }), 201


@books_bp.route("/admin/books/<book_id>", methods=["PUT"])
@books_bp.route("/books/<book_id>", methods=["PUT"])
@admin_required
def admin_update_book(book_id: str):
    """Admin: update an existing book."""
    payload = request.get_json(silent=True) or {}
    updated = update("books", book_id, payload)
    if not updated:
        return jsonify({"success": False, "error": f"Book '{book_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Book updated successfully",
        "data": updated
    }), 200


@books_bp.route("/admin/books/<book_id>", methods=["DELETE"])
@books_bp.route("/books/<book_id>", methods=["DELETE"])
@admin_required
def admin_delete_book(book_id: str):
    """Admin: delete a book entry."""
    success = delete("books", book_id)
    if not success:
        return jsonify({"success": False, "error": f"Book '{book_id}' not found"}), 404
        
    return jsonify({
        "success": True,
        "message": "Book deleted successfully"
    }), 200


@books_bp.route("/admin/books/<book_id>/publish", methods=["PATCH"])
@admin_required
def admin_toggle_publish_book(book_id: str):
    """Admin: toggle or set published state."""
    book = get_by_id("books", book_id)
    if not book:
        return jsonify({"success": False, "error": f"Book '{book_id}' not found"}), 404
        
    payload = request.get_json(silent=True) or {}
    if "published" in payload:
        new_state = bool(payload["published"])
    else:
        new_state = not book.get("published", False)
        
    updated = update("books", book_id, {"published": new_state})
    return jsonify({
        "success": True,
        "message": f"Book publish status updated to {new_state}",
        "data": updated
    }), 200
