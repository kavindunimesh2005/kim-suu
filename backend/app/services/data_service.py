"""Data service handling atomic JSON storage operations."""
import json
import os
import re
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from backend.app.config import Config

# Global lock for thread-safe file operations
_data_lock = threading.Lock()


def _get_file_path(name: str) -> Path:
    """Return Path to data file, adding .json extension if missing."""
    if not name.endswith(".json"):
        name = f"{name}.json"
    return Config.DATA_FOLDER / name


def slugify(text: str) -> str:
    """Generate a clean URL-friendly slug from text."""
    if not text:
        return str(uuid.uuid4())[:8]
    # Replace whitespace and special characters with hyphens
    slug = re.sub(r"[^\w\s-]", "", text.strip().lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return slug or str(uuid.uuid4())[:8]


def load_data(name: str):
    """Load JSON content from a data file. Returns list or dict."""
    file_path = _get_file_path(name)
    with _data_lock:
        if not file_path.exists():
            return []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            return []


def save_data(name: str, data) -> bool:
    """
    Atomically save JSON data to file.
    Writes to a temporary file, verifies readability, then atomically replaces target.
    """
    file_path = _get_file_path(name)
    file_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = file_path.with_suffix(".tmp")
    
    with _data_lock:
        try:
            # 1. Write to temporary file
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.flush()
                os.fsync(f.fileno())
            
            # 2. Verify temporary file is valid JSON
            with open(temp_path, "r", encoding="utf-8") as f:
                json.load(f)
                
            # 3. Atomic replacement
            os.replace(temp_path, file_path)
            return True
        except Exception as e:
            if temp_path.exists():
                try:
                    os.remove(temp_path)
                except OSError:
                    pass
            raise IOError(f"Failed to atomically write {file_path}: {e}")


# ==========================================
# Collection CRUD helpers (Books, Blogs, Stories, Gallery, Messages)
# ==========================================

def is_item_published(item: dict) -> bool:
    """Return True if item is marked published via published: true or status: 'published'."""
    if not isinstance(item, dict):
        return False
    if item.get("published") is True:
        return True
    if str(item.get("status", "")).lower() == "published":
        return True
    return False


def get_all(collection_name: str, filter_published: bool = False):
    """Get all items from a collection, optionally filtering for published == True."""
    items = load_data(collection_name)
    if not isinstance(items, list):
        return []
    if filter_published:
        return [item for item in items if is_item_published(item)]
    return items


def get_by_id(collection_name: str, item_id: str, filter_published: bool = False):
    """Find a single item by id."""
    items = get_all(collection_name, filter_published=filter_published)
    for item in items:
        if str(item.get("id")) == str(item_id):
            return item
    return None


def get_by_slug(collection_name: str, slug: str, filter_published: bool = False):
    """Find a single item by slug."""
    items = get_all(collection_name, filter_published=filter_published)
    for item in items:
        if item.get("slug") == slug:
            return item
    return None


def create(collection_name: str, item_data: dict) -> dict:
    """Create a new item in collection."""
    items = load_data(collection_name)
    if not isinstance(items, list):
        items = []

    now_iso = datetime.now(timezone.utc).isoformat()
    new_item = dict(item_data)
    
    # Generate unique ID if not present
    if "id" not in new_item or not new_item["id"]:
        prefix = collection_name.rstrip("s")
        new_item["id"] = f"{prefix}-{uuid.uuid4().hex[:8]}"
        
    # Generate slug if applicable and not provided
    if "slug" not in new_item or not new_item["slug"]:
        source_title = new_item.get("title_en") or new_item.get("title_si") or new_item.get("title")
        if source_title:
            base_slug = slugify(source_title)
            # Ensure slug uniqueness in collection
            slug_candidate = base_slug
            counter = 1
            existing_slugs = {x.get("slug") for x in items if "slug" in x}
            while slug_candidate in existing_slugs:
                slug_candidate = f"{base_slug}-{counter}"
                counter += 1
            new_item["slug"] = slug_candidate
            
    # Default published to False for drafts if not specified
    if "published" not in new_item:
        new_item["published"] = False
        
    new_item["created_at"] = now_iso
    new_item["updated_at"] = now_iso
    
    items.append(new_item)
    save_data(collection_name, items)
    return new_item


def update(collection_name: str, item_id: str, update_data: dict):
    """Update an existing item by ID."""
    items = load_data(collection_name)
    if not isinstance(items, list):
        return None
        
    target_idx = None
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(item_id):
            target_idx = idx
            break
            
    if target_idx is None:
        return None
        
    target_item = dict(items[target_idx])
    
    # Merge updates (preserve id and created_at)
    created_at = target_item.get("created_at")
    target_item.update(update_data)
    target_item["id"] = item_id
    if created_at:
        target_item["created_at"] = created_at
    target_item["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    items[target_idx] = target_item
    save_data(collection_name, items)
    return target_item


def delete(collection_name: str, item_id: str) -> bool:
    """Delete an item by ID."""
    items = load_data(collection_name)
    if not isinstance(items, list):
        return False
        
    initial_len = len(items)
    filtered = [x for x in items if str(x.get("id")) != str(item_id)]
    
    if len(filtered) == initial_len:
        return False
        
    save_data(collection_name, filtered)
    return True


# ==========================================
# Single-Object Helpers (author, settings, admin)
# ==========================================

def get_single(name: str) -> dict:
    """Get single document data (dict)."""
    data = load_data(name)
    if isinstance(data, dict):
        return data
    return {}


def update_single(name: str, update_data: dict) -> dict:
    """Update single document data with merged fields."""
    current = get_single(name)
    current.update(update_data)
    current["updated_at"] = datetime.now(timezone.utc).isoformat()
    save_data(name, current)
    return current
