#!/bin/bash

# Install Python packages using pip
pip install --no-cache-dir -r requirements.txt
pip install --no-cache-dir "uvicorn[standard]==0.34.3" gunicorn

# Set Python path
export PYTHONPATH=/app
export PYTHONUNBUFFERED=1

# Run the application using gunicorn
exec gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} 