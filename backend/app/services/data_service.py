import json
import os
import tempfile
import uuid

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data')

def _get_file_path(collection_name):
    return os.path.join(DATA_DIR, f"{collection_name}.json")

def load_data(collection_name, default=None):
    """Safely read JSON data from file."""
    path = _get_file_path(collection_name)
    if not os.path.exists(path):
        return default if default is not None else []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {collection_name}: {e}")
        return default if default is not None else []

def save_data(collection_name, data):
    """Safely write JSON data using atomic file replacement."""
    os.makedirs(DATA_DIR, exist_ok=True)
    target_path = _get_file_path(collection_name)
    
    # Write to a temporary file first in the same directory, then rename atomically
    dir_name = os.path.dirname(target_path)
    with tempfile.NamedTemporaryFile('w', dir=dir_name, delete=False, encoding='utf-8') as tf:
        json.dump(data, tf, ensure_ascii=False, indent=2)
        temp_name = tf.name
        
    try:
        # Atomic replace
        os.replace(temp_name, target_path)
        return True
    except Exception as e:
        print(f"Error saving {collection_name}: {e}")
        if os.path.exists(temp_name):
            try:
                os.remove(temp_name)
            except Exception:
                pass
        return False

# CRUD Helpers
def get_all(collection_name):
    return load_data(collection_name, [])

def get_by_id(collection_name, item_id):
    items = load_data(collection_name, [])
    if isinstance(items, list):
        for item in items:
            if str(item.get('id')) == str(item_id) or str(item.get('slug')) == str(item_id):
                return item
    return None

def create_item(collection_name, item_dict):
    items = load_data(collection_name, [])
    if 'id' not in item_dict or not item_dict['id']:
        item_dict['id'] = f"{collection_name[:4]}-{uuid.uuid4().hex[:8]}"
    items.append(item_dict)
    save_data(collection_name, items)
    return item_dict

def update_item(collection_name, item_id, updated_fields):
    items = load_data(collection_name, [])
    updated = False
    for i, item in enumerate(items):
        if str(item.get('id')) == str(item_id) or str(item.get('slug')) == str(item_id):
            items[i].update(updated_fields)
            updated = True
            save_data(collection_name, items)
            return items[i]
    return None

def delete_item(collection_name, item_id):
    items = load_data(collection_name, [])
    original_count = len(items)
    items = [item for item in items if str(item.get('id')) != str(item_id) and str(item.get('slug')) != str(item_id)]
    if len(items) < original_count:
        save_data(collection_name, items)
        return True
    return False

# Single Object Helpers (e.g. author.json, settings.json, admin.json)
def get_single(collection_name):
    return load_data(collection_name, {})

def update_single(collection_name, data):
    current = load_data(collection_name, {})
    if isinstance(current, dict):
        current.update(data)
        save_data(collection_name, current)
        return current
    else:
        save_data(collection_name, data)
        return data
