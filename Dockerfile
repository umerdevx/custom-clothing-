# Use official lightweight Python base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Set working directory inside container
WORKDIR /app

# Install system dependencies (required for compiling some packages if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source files
COPY main.py .
COPY database/ ./database/
COPY models/ ./models/
COPY schemas/ ./schemas/
COPY routers/ ./routers/

# Create uploads directory for custom logo uploads
RUN mkdir -p /app/uploads/logos

# Expose API port
EXPOSE 8001

# Command to launch the ASGI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
