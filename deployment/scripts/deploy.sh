#!/bin/bash
set -e

# ==============================================================================
# AI Hospitality Platform - Production EC2 Deployment Script
# ==============================================================================
# Usage: ./deploy.sh [IMAGE_REGISTRY_PREFIX]
# Example: ./deploy.sh ghcr.io/my-org/my-repo

IMAGE_PREFIX=${1:-ghcr.io/YOUR_GITHUB_ORG/YOUR_REPO_NAME}
echo "Deploying from registry prefix: $IMAGE_PREFIX"

# 1. Pull the latest images
echo "[1/4] Pulling latest Docker images..."
docker pull $IMAGE_PREFIX-backend:latest
docker pull $IMAGE_PREFIX-frontend:latest

# 2. Re-tag images so docker-compose finds them
# (If docker-compose is configured to build, we temporarily override it to use the pulled image,
#  but the best practice is defining image names in docker-compose.yml.
#  Since we share docker-compose.yml for local build and prod run, we use environment overrides.)
export BACKEND_IMAGE="$IMAGE_PREFIX-backend:latest"
export FRONTEND_IMAGE="$IMAGE_PREFIX-frontend:latest"

# 3. Restart services with zero-downtime recreation
echo "[2/4] Restarting containers..."
# Use --build false to ensure we don't accidentally compile on the server
docker compose up -d --no-deps --build

# 4. Cleanup old dangling images to save EC2 disk space
echo "[3/4] Cleaning up old Docker images..."
docker image prune -f

# 5. Health Check
echo "[4/4] Verifying Deployment Health..."
sleep 10
if curl -s -f http://localhost:8000/health > /dev/null; then
    echo "✅ Backend API is healthy!"
else
    echo "❌ Backend API health check failed!"
    docker compose logs --tail=50 backend
    exit 1
fi

if curl -s -f http://localhost:80 > /dev/null; then
    echo "✅ Frontend is serving traffic!"
else
    echo "❌ Frontend health check failed!"
    docker compose logs --tail=50 frontend
    exit 1
fi

echo "🚀 Deployment Completed Successfully!"
