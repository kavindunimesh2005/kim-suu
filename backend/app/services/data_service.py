import json
import os
import tempfile
import uuid

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data')
TMP_DATA_DIR = os.path.join(tempfile.gettempdir(), 'kim_suu_data')

def _get_writable_path(collection_name):
    """Determine the best path to write data to (preferring standard DATA_DIR)."""
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        # Test write capability
        test_file = os.path.join(DATA_DIR, '.write_test')
        with open(test_file, 'w') as f:
            f.write('ok')
        os.remove(test_file)
        return os.path.join(DATA_DIR, f"{collection_name}.json")
    except (OSError, PermissionError):
        os.makedirs(TMP_DATA_DIR, exist_ok=True)
        return os.path.join(TMP_DATA_DIR, f"{collection_name}.json")

def load_data(collection_name, default=None):
    """Safely read JSON data from file (checking tmp override first, then standard DATA_DIR)."""
    # 1. Check if an updated version exists in TMP_DATA_DIR
    tmp_path = os.path.join(TMP_DATA_DIR, f"{collection_name}.json")
    if os.path.exists(tmp_path):
        try:
            with open(tmp_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading tmp data for {collection_name}: {e}")

    # 2. Check standard DATA_DIR
    path = os.path.join(DATA_DIR, f"{collection_name}.json")
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {collection_name}: {e}")
            
    return default if default is not None else []

def save_data(collection_name, data):
    """Safely write JSON data with atomic file replacement and automatic tmp fallback."""
    # 1. Try standard DATA_DIR first
    data_dir_path = os.path.join(DATA_DIR, f"{collection_name}.json")
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        tmp_target = f"{data_dir_path}.tmp"
        with open(tmp_target, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp_target, data_dir_path)
        
        # If a tmp version exists, sync it too
        tmp_path = os.path.join(TMP_DATA_DIR, f"{collection_name}.json")
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass
        return True
    except Exception as e:
        print(f"Direct write to {data_dir_path} failed: {e}. Writing to temp directory fallback...")
        # 2. Fallback to TMP_DATA_DIR (e.g. read-only serverless filesystem)
        try:
            os.makedirs(TMP_DATA_DIR, exist_ok=True)
            tmp_path = os.path.join(TMP_DATA_DIR, f"{collection_name}.json")
            tmp_target = f"{tmp_path}.tmp"
            with open(tmp_target, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            os.replace(tmp_target, tmp_path)
            return True
        except Exception as inner_e:
            print(f"Fallback save failed: {inner_e}")
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
