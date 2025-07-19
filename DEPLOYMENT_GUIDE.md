# CareerForge AI Deployment Guide for careerforge.info

This guide will help you deploy your CareerForge AI application to your `careerforge.info` domain with both frontend and backend served from the same domain.

## 🚀 Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Domain `careerforge.info` pointing to your server
   - SSL certificates for your domain

2. **Deploy with one command:**
   ```bash
   chmod +x deploy_to_careerforge.sh
   ./deploy_to_careerforge.sh
   ```

## 📋 Prerequisites

### 1. Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- 2GB RAM minimum (4GB recommended)
- 20GB disk space
- Docker and Docker Compose

### 2. Domain Setup
- Point `careerforge.info` to your server's IP
- Point `www.careerforge.info` to your server's IP

### 3. SSL Certificates
Get free SSL certificates from Let's Encrypt:
```bash
sudo apt update
sudo apt install certbot
sudo certbot certonly --standalone -d careerforge.info -d www.careerforge.info
```

Then copy the certificates:
```bash
sudo cp /etc/letsencrypt/live/careerforge.info/fullchain.pem nginx/ssl/careerforge.info.crt
sudo cp /etc/letsencrypt/live/careerforge.info/privkey.pem nginx/ssl/careerforge.info.key
sudo chown $USER:$USER nginx/ssl/*
```

## 🔧 Configuration

### 1. Environment Variables
Edit `.env.production` with your actual values:

```bash
# Database
POSTGRES_PASSWORD=your_secure_password_here

# Security
SECRET_KEY=your_very_secure_secret_key_here

# Razorpay (Live Mode)
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_secret_key
RAZORPAY_MODE=live
```

### 2. Single Domain Configuration
The application will be accessible at:
- **Main Site**: https://careerforge.info
- **API**: https://careerforge.info/api
- **API Docs**: https://careerforge.info/docs
- **Admin Panel**: https://careerforge.info/admin

### 3. Nginx Routing
Nginx will route requests as follows:
- `/api/*` → Backend API
- `/admin/*` → Backend Admin
- `/static/*` → Backend Static Files
- `/uploads/*` → Backend Uploads
- `/docs` → API Documentation
- `/openapi.json` → OpenAPI Schema
- `/*` → Frontend React App

## 🐳 Docker Deployment

### Option 1: Production Deployment (Recommended)
```bash
# Deploy with production configuration
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Option 2: Development Deployment
```bash
# Deploy with development configuration
docker-compose up -d --build
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Health Checks
```bash
# Frontend health
curl https://careerforge.info/health

# API health
curl https://careerforge.info/api/health
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### SSL Certificate Renewal
```bash
# Renew certificates
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/careerforge.info/fullchain.pem nginx/ssl/careerforge.info.crt
sudo cp /etc/letsencrypt/live/careerforge.info/privkey.pem nginx/ssl/careerforge.info.key
sudo chown $USER:$USER nginx/ssl/*

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Database Backup
```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres careerforge > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres careerforge < backup.sql
```

## 🛠️ Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   ```bash
   # Check certificate validity
   openssl x509 -in nginx/ssl/careerforge.info.crt -text -noout
   ```

2. **Port Conflicts**
   ```bash
   # Check what's using ports 80/443
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

3. **Docker Issues**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker volume prune
   ```

4. **Service Not Starting**
   ```bash
   # Check service status
   docker-compose -f docker-compose.prod.yml ps
   
   # Check logs
   docker-compose -f docker-compose.prod.yml logs service_name
   ```

5. **Nginx Configuration Issues**
   ```bash
   # Test nginx configuration
   docker-compose -f docker-compose.prod.yml exec nginx nginx -t
   
   # Reload nginx
   docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
   ```

### Performance Optimization

1. **Enable Gzip Compression** (already configured in nginx.conf)
2. **Use CDN** for static assets
3. **Enable Redis Caching** (already configured)
4. **Database Optimization**:
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_jobs_title ON jobs(title);
   ```

## 🔒 Security

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Regular Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Load Balancer
Consider using a load balancer like HAProxy or AWS ALB for high traffic.

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify SSL certificates are valid
3. Ensure all environment variables are set correctly
4. Check domain DNS settings
5. Test nginx configuration: `docker-compose -f docker-compose.prod.yml exec nginx nginx -t`

## 🎉 Success!

Your CareerForge AI application should now be running at:
- **Main Site**: https://careerforge.info
- **API**: https://careerforge.info/api
- **Documentation**: https://careerforge.info/docs
- **Admin Panel**: https://careerforge.info/admin 