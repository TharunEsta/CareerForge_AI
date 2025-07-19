#!/bin/bash

# CareerForge AI Deployment Script for careerforge.info
# This script will deploy your application to your domain

set -e

echo "🚀 Starting CareerForge AI deployment to careerforge.info..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${BLUE}Creating necessary directories...${NC}"
mkdir -p nginx/ssl

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/careerforge.info.crt" ] || [ ! -f "nginx/ssl/careerforge.info.key" ]; then
    echo -e "${YELLOW}SSL certificates not found in nginx/ssl/ directory${NC}"
    echo -e "${BLUE}Please place your SSL certificates:${NC}"
    echo -e "  - nginx/ssl/careerforge.info.crt"
    echo -e "  - nginx/ssl/careerforge.info.key"
    echo -e "${YELLOW}You can get free SSL certificates from Let's Encrypt:${NC}"
    echo -e "  sudo certbot certonly --standalone -d careerforge.info -d www.careerforge.info"
    echo -e "${BLUE}Then copy the certificates to nginx/ssl/ directory${NC}"
    read -p "Press Enter to continue after placing SSL certificates..."
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo -e "${BLUE}Creating .env.production file...${NC}"
    cat > .env.production << EOF
# Production Environment Variables for careerforge.info

# Database
POSTGRES_PASSWORD=your_secure_postgres_password_here
DATABASE_URL=postgresql://postgres:your_secure_postgres_password_here@postgres:5432/careerforge

# Security
SECRET_KEY=your_very_secure_secret_key_here_change_this_in_production

# Razorpay Configuration (Live Mode)
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_secret_key
RAZORPAY_MODE=live

# Redis
REDIS_URL=redis://redis:6379

# CORS Origins (Single Domain)
CORS_ORIGINS=https://careerforge.info,https://www.careerforge.info

# Frontend Environment (Single Domain)
NEXT_PUBLIC_API_URL=https://careerforge.info/api
NEXT_PUBLIC_APP_URL=https://careerforge.info

# SSL Certificate Paths (for Nginx)
SSL_CERT_PATH=/etc/nginx/ssl/careerforge.info.crt
SSL_KEY_PATH=/etc/nginx/ssl/careerforge.info.key
EOF
    echo -e "${YELLOW}Please edit .env.production with your actual values before continuing${NC}"
    read -p "Press Enter after updating .env.production..."
fi

# Build and start services
echo -e "${BLUE}Building and starting services...${NC}"
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Wait for services to be ready
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 30

# Check service status
echo -e "${BLUE}Checking service status...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Test the application
echo -e "${BLUE}Testing application...${NC}"
if curl -f -s https://careerforge.info/health > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible at https://careerforge.info${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check failed. Check logs with: docker-compose -f docker-compose.prod.yml logs frontend${NC}"
fi

if curl -f -s https://careerforge.info/api/health > /dev/null; then
    echo -e "${GREEN}✅ API is accessible at https://careerforge.info/api${NC}"
else
    echo -e "${YELLOW}⚠️  API health check failed. Check logs with: docker-compose -f docker-compose.prod.yml logs backend${NC}"
fi

# Show logs
echo -e "${BLUE}Recent logs:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}Your CareerForge AI application is now accessible at:${NC}"
echo -e "  - Main Site: https://careerforge.info"
echo -e "  - API: https://careerforge.info/api"
echo -e "  - API Docs: https://careerforge.info/docs"
echo -e "  - Admin Panel: https://careerforge.info/admin"

echo -e "${BLUE}Useful commands:${NC}"
echo -e "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo -e "  - Stop services: docker-compose -f docker-compose.prod.yml down"
echo -e "  - Restart services: docker-compose -f docker-compose.prod.yml restart"
echo -e "  - Update and redeploy: ./deploy_to_careerforge.sh" 