from flask import Blueprint, jsonify, request
from app.services.data_service import get_all, get_by_id, create_item, update_item, delete_item
from app.auth.auth_service import admin_required

books_bp = Blueprint('books', __name__)

@books_bp.route('', methods=['GET'])
def list_books():
    books = get_all('books')
    status_filter = request.args.get('status')
    if status_filter:
        books = [b for b in books if b.get('status') == status_filter]
    return jsonify(books)

@books_bp.route('/<identifier>', methods=['GET'])
def get_book(identifier):
    book = get_by_id('books', identifier)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book)

@books_bp.route('', methods=['POST'])
@admin_required
def create_book():
    data = request.get_json()
    if not data or not data.get('title_si') or not data.get('title_en'):
        return jsonify({"error": "Sinhala and English titles are required"}), 400
    if not data.get('slug'):
        data['slug'] = data.get('title_en').lower().replace(' ', '-')
    new_book = create_item('books', data)
    return jsonify(new_book), 201

@books_bp.route('/<identifier>', methods=['PUT'])
@admin_required
def update_book(identifier):
    data = request.get_json()
    updated = update_item('books', identifier, data)
    if not updated:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(updated)

@books_bp.route('/<identifier>', methods=['DELETE'])
@admin_required
def delete_book(identifier):
    success = delete_item('books', identifier)
    if not success:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"success": True, "message": "Book deleted successfully"})
