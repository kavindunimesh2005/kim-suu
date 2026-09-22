from flask import Blueprint, jsonify, request
import datetime
from app.services.data_service import get_all, get_by_id, create_item, update_item, delete_item
from app.auth.auth_service import admin_required

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('', methods=['POST'])
def send_contact_message():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()
    
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400
        
    # Basic email validation
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Please provide a valid email address"}), 400
        
    new_msg = {
        "name": name,
        "email": email,
        "subject": subject or "Inquiry from website",
        "message": message,
        "date": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status": "new"
    }
    
    created = create_item('messages', new_msg)
    return jsonify({
        "success": True,
        "message_si": "ඔබගේ පණිවිඩය සාර්ථකව යොමු කෙරිණි. කතුවරියගේ කණ්ඩායම ඔබ හා සම්බන්ධ වනු ඇත.",
        "message_en": "Your message has been sent successfully. The author will be in touch soon.",
        "data": created
    }), 201

# Admin Message Management Endpoints
@contact_bp.route('/admin/messages', methods=['GET'])
@admin_required
def get_all_messages():
    status = request.args.get('status')
    messages = get_all('messages')
    if status:
        messages = [m for m in messages if m.get('status') == status]
    # Sort descending by date
    messages.sort(key=lambda m: m.get('date', ''), reverse=True)
    return jsonify(messages)

@contact_bp.route('/admin/messages/<identifier>', methods=['PUT'])
@admin_required
def update_message_status(identifier):
    data = request.get_json()
    if not data or not data.get('status'):
        return jsonify({"error": "Status is required"}), 400
    valid_statuses = ['new', 'read', 'replied', 'archived']
    if data['status'] not in valid_statuses:
        return jsonify({"error": f"Status must be one of {valid_statuses}"}), 400
    updated = update_item('messages', identifier, {"status": data['status']})
    if not updated:
        return jsonify({"error": "Message not found"}), 404
    return jsonify(updated)

@contact_bp.route('/admin/messages/<identifier>', methods=['DELETE'])
@admin_required
def delete_message(identifier):
    success = delete_item('messages', identifier)
    if not success:
        return jsonify({"error": "Message not found"}), 404
    return jsonify({"success": True, "message": "Message deleted successfully"})
