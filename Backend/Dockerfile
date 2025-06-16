FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Expose the port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app
ENV PATH="/usr/local/bin:${PATH}"
ENV PYTHONUNBUFFERED=1

# Command to run the application using gunicorn
CMD ["gunicorn", "main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"] 