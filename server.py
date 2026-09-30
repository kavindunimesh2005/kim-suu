import os
import sys

# Ensure backend root is in python path
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import create_app from backend/app.py
import app as backend_module

app = backend_module.create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Suchetha Kapuarachchi Portfolio on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
