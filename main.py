try:
    from Backend.main import app
    print("Successfully imported app from Backend.main")
except ImportError as e:
    print(f"Import error: {e}")
    raise

# This file allows Railway to detect the Python app and run it from the root. 