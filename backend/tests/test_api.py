"""Comprehensive automated tests for Suchetha Kapuarachchi Portfolio API."""
import io
import json
import sys
import unittest
from pathlib import Path
from PIL import Image

# Ensure project root is in python path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
root_dir = backend_dir.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app import create_app
from backend.app.services.data_service import get_all, delete


class PortfolioAPITestCase(unittest.TestCase):
    """Test suite covering public endpoints, admin auth, CRUD, and uploads."""

    @classmethod
    def setUpClass(cls):
        """Initialize test client and obtain admin token."""
        cls.app = create_app("testing")
        cls.client = cls.app.test_client()
        
        # Authenticate with development admin credentials
        login_res = cls.client.post(
            "/api/admin/login",
            json={"username": "Kavii", "password": "Kavii@2005"}
        )
        data = json.loads(login_res.data.decode("utf-8"))
        assert login_res.status_code == 200, f"Login failed: {data}"
        cls.token = data["token"]
        cls.auth_headers = {
            "Authorization": f"Bearer {cls.token}",
            "Content-Type": "application/json"
        }

    # ==========================================
    # 1. Health Check
    # ==========================================
    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("status"), "healthy")

    # ==========================================
    # 2. Authentication
    # ==========================================
    def test_02_admin_login_failure(self):
        res = self.client.post(
            "/api/admin/login",
            json={"username": "Kavii", "password": "WrongPassword"}
        )
        self.assertEqual(res.status_code, 401)
        data = json.loads(res.data)
        self.assertFalse(data.get("success"))

    def test_03_admin_verify_session(self):
        res = self.client.get("/api/admin/verify", headers=self.auth_headers)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data.get("success"))
        self.assertEqual(data["user"]["username"], "Kavii")

    def test_04_admin_protected_route_without_token(self):
        res = self.client.get("/api/admin/dashboard")
        self.assertEqual(res.status_code, 401)

    # ==========================================
    # 3. Books
    # ==========================================
    def test_05_public_get_books(self):
        res = self.client.get("/api/books")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data.get("success"))
        self.assertGreaterEqual(len(data.get("data", [])), 2)
        # Verify all returned books are published
        for book in data["data"]:
            self.assertTrue(book.get("published", True))

    def test_06_get_book_by_slug(self):
        res = self.client.get("/api/books/hulu-aththa")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["data"]["slug"], "hulu-aththa")
        self.assertEqual(data["data"]["title_si"], "හුළු අත්ත")

    def test_07_book_crud_lifecycle(self):
        # Create draft book
        new_book_payload = {
            "title_si": "ටෙස්ට් නවකතාව",
            "title_en": "Test Novel",
            "author": "Suchetha Kapuarachchi",
            "published_year": "2026",
            "published": False
        }
        res = self.client.post("/api/admin/books", headers=self.auth_headers, json=new_book_payload)
        self.assertEqual(res.status_code, 201)
        created = json.loads(res.data)["data"]
        book_id = created["id"]
        
        # Verify it's NOT in public list (because published == False)
        public_res = self.client.get("/api/books")
        public_data = json.loads(public_res.data)
        self.assertNotIn(book_id, [b["id"] for b in public_data["data"]])
        
        # Publish it via PATCH
        patch_res = self.client.patch(
            f"/api/admin/books/{book_id}/publish",
            headers=self.auth_headers,
            json={"published": True}
        )
        self.assertEqual(patch_res.status_code, 200)
        
        # Verify it IS now in public list
        public_res2 = self.client.get("/api/books")
        public_data2 = json.loads(public_res2.data)
        self.assertIn(book_id, [b["id"] for b in public_data2["data"]])
        
        # Delete it
        del_res = self.client.delete(f"/api/admin/books/{book_id}", headers=self.auth_headers)
        self.assertEqual(del_res.status_code, 200)

    # ==========================================
    # 4. Blogs
    # ==========================================
    def test_08_public_get_blogs_and_filters(self):
        res = self.client.get("/api/blogs")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data.get("success"))
        self.assertGreaterEqual(data["total"], 1)
        
        # Test category filter
        cat_res = self.client.get("/api/blogs?category=Literary Reflections")
        self.assertEqual(cat_res.status_code, 200)
        cat_data = json.loads(cat_res.data)
        self.assertGreaterEqual(cat_data["count"], 1)
        
        # Test search
        search_res = self.client.get("/api/blogs?search=Arungal")
        self.assertEqual(search_res.status_code, 200)
        search_data = json.loads(search_res.data)
        self.assertGreaterEqual(search_data["count"], 1)

    def test_09_blog_crud_lifecycle(self):
        new_blog_payload = {
            "title_si": "නවක ලේඛන සටහන",
            "title_en": "Fresh Writing Note",
            "content_si": "අකුරු අතර නිහඬතාවය ගලායයි.",
            "content_en": "Silence flows between letters.",
            "category": "Writing Craft",
            "published": True
        }
        res = self.client.post("/api/admin/blogs", headers=self.auth_headers, json=new_blog_payload)
        self.assertEqual(res.status_code, 201)
        created = json.loads(res.data)["data"]
        blog_id = created["id"]
        
        # Update blog
        upd_res = self.client.put(
            f"/api/admin/blogs/{blog_id}",
            headers=self.auth_headers,
            json={"title_en": "Updated Writing Note"}
        )
        self.assertEqual(upd_res.status_code, 200)
        self.assertEqual(json.loads(upd_res.data)["data"]["title_en"], "Updated Writing Note")
        
        # Clean up
        del_res = self.client.delete(f"/api/admin/blogs/{blog_id}", headers=self.auth_headers)
        self.assertEqual(del_res.status_code, 200)

    # ==========================================
    # 5. Stories & Poems
    # ==========================================
    def test_10_stories_and_category_filter(self):
        res = self.client.get("/api/stories")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertGreaterEqual(data["count"], 5)
        
        # Filter by category
        res_poem = self.client.get("/api/stories?category=Poems")
        self.assertEqual(res_poem.status_code, 200)
        data_poem = json.loads(res_poem.data)
        self.assertGreaterEqual(data_poem["count"], 1)

    # ==========================================
    # 6. Gallery
    # ==========================================
    def test_11_gallery_endpoints(self):
        res = self.client.get("/api/gallery")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertGreaterEqual(data["count"], 1)

    # ==========================================
    # 7. Author Profile
    # ==========================================
    def test_12_author_profile(self):
        res = self.client.get("/api/author")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["data"]["name"], "Suchetha Kapuarachchi")
        self.assertEqual(data["data"]["pen_name"], "Kim Suu Ah")

    # ==========================================
    # 8. Contact Form & Messages
    # ==========================================
    def test_13_contact_validation_and_submission(self):
        # Invalid email
        invalid_res = self.client.post("/api/contact", json={
            "name": "Kamal",
            "email": "not-an-email",
            "message": "Hello author"
        })
        self.assertEqual(invalid_res.status_code, 400)
        
        # Valid submission
        valid_res = self.client.post("/api/contact", json={
            "name": "Kamal Perera",
            "email": "kamal.perera@example.com",
            "subject": "Book Signing Inquiry",
            "message": "I adore your novel Hulu Aththa! When is your next book reading event?"
        })
        self.assertEqual(valid_res.status_code, 201)
        created = json.loads(valid_res.data)["data"]
        msg_id = created["id"]
        
        # Admin can view message
        admin_res = self.client.get("/api/admin/messages", headers=self.auth_headers)
        self.assertEqual(admin_res.status_code, 200)
        messages = json.loads(admin_res.data)["data"]
        self.assertIn(msg_id, [m["id"] for m in messages])
        
        # Mark as read
        read_res = self.client.put(
            f"/api/admin/messages/{msg_id}/read",
            headers=self.auth_headers,
            json={"read": True}
        )
        self.assertEqual(read_res.status_code, 200)
        
        # Delete message
        del_res = self.client.delete(f"/api/admin/messages/{msg_id}", headers=self.auth_headers)
        self.assertEqual(del_res.status_code, 200)

    # ==========================================
    # 9. Website Settings
    # ==========================================
    def test_14_settings_endpoints(self):
        res = self.client.get("/api/settings")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["data"]["default_theme"], "default")

    # ==========================================
    # 10. Admin Dashboard
    # ==========================================
    def test_15_admin_dashboard_stats(self):
        res = self.client.get("/api/admin/dashboard", headers=self.auth_headers)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data["success"])
        self.assertIn("counts", data)
        self.assertGreaterEqual(data["counts"]["books"]["total"], 2)
        self.assertGreaterEqual(data["counts"]["blogs"]["total"], 1)
        self.assertGreaterEqual(data["counts"]["stories"]["total"], 5)
        self.assertGreaterEqual(data["counts"]["gallery"]["total"], 1)

    # ==========================================
    # 11. Secure Image Upload
    # ==========================================
    def test_16_image_upload(self):
        # Generate a small in-memory test PNG
        img = Image.new("RGB", (100, 100), color="green")
        byte_arr = io.BytesIO()
        img.save(byte_arr, format="PNG")
        byte_arr.seek(0)
        
        res = self.client.post(
            "/api/admin/upload",
            headers={"Authorization": f"Bearer {self.token}"},
            data={
                "category": "books",
                "file": (byte_arr, "test-cover.png")
            },
            content_type="multipart/form-data"
        )
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data["success"])
        self.assertTrue(data["data"]["url"].startswith("/uploads/books/"))
        self.assertEqual(data["data"]["width"], 100)
        self.assertEqual(data["data"]["height"], 100)
        
        # Verify static serving endpoint
        upload_url = data["data"]["url"]
        serve_res = self.client.get(upload_url)
        self.assertEqual(serve_res.status_code, 200)
        serve_res.close()  # Release file handle on Windows
        
        # Clean up uploaded test file
        filename = data["data"]["filename"]
        target_file = backend_dir / "uploads" / "books" / filename
        if target_file.exists():
            try:
                target_file.unlink()
            except OSError:
                pass


if __name__ == "__main__":
    unittest.main()
