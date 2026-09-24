"""Automated tests for unified SPA static serving and routing fallbacks."""
import json
import sys
import unittest
from pathlib import Path

current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
root_dir = backend_dir.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app import create_app


class SPAServingTestCase(unittest.TestCase):
    """Test suite ensuring Flask properly serves the React SPA build."""

    @classmethod
    def setUpClass(cls):
        cls.app = create_app("testing")
        cls.client = cls.app.test_client()

    def test_root_serves_spa(self):
        """Root GET / must serve React index.html."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"<html", res.data.lower())
        self.assertIn(b"<div id=\"root\">", res.data)

    def test_client_routes_serve_spa(self):
        """Direct browser navigation to React Router paths must serve index.html."""
        routes = ["/about", "/books", "/books/hulu-aththa", "/blog", "/gallery", "/contact", "/admin"]
        for route in routes:
            with self.subTest(route=route):
                res = self.client.get(route)
                self.assertEqual(res.status_code, 200, f"Failed for route {route}")
                self.assertIn(b"<div id=\"root\">", res.data)

    def test_api_routes_not_intercepted(self):
        """Unknown /api/ routes must return 404 JSON, NOT index.html."""
        res = self.client.get("/api/nonexistent-route-for-testing")
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertIsNotNone(data)
        self.assertFalse(data.get("success", True))

    def test_static_assets_served(self):
        """Static files in dist/assets must be served with appropriate content types."""
        dist_assets = list((root_dir / "frontend" / "dist" / "assets").glob("*.css"))
        if dist_assets:
            asset_name = dist_assets[0].name
            res = self.client.get(f"/assets/{asset_name}")
            self.assertEqual(res.status_code, 200)
            self.assertIn("text/css", res.headers.get("Content-Type", ""))


if __name__ == "__main__":
    unittest.main()
