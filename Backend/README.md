# CareerForge AI Backend

A production-ready FastAPI backend for CareerForge AI - an AI-powered career optimization platform.

## 🚀 Features

- **AI Chat API**: Real-time AI-powered career assistance
- **Resume Parsing**: Advanced resume analysis and ATS optimization
- **Job Matching**: Intelligent job matching based on skills and experience
- **Subscription Management**: Complete billing and subscription system
- **Payment Processing**: Stripe and PayPal integration
- **User Authentication**: JWT-based authentication system
- **File Upload**: Secure resume file upload and processing
- **Rate Limiting**: Built-in rate limiting for API protection
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Documentation**: Auto-generated API documentation

## 🛠 Tech Stack

- **Framework**: FastAPI with Python 3.11
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with OAuth2
- **File Processing**: PyMuPDF, python-docx, docx2txt
- **AI/ML**: OpenAI API, spaCy, sentence-transformers
- **Payment**: Stripe, PayPal integration
- **Monitoring**: Prometheus metrics, structured logging
- **Deployment**: Docker, Gunicorn, Uvicorn

## 📦 Installation

### Prerequisites
- Python 3.11+
- pip
- git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Run the development server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## 🏗 Building for Production

### Docker Build
```bash
# Build the Docker image
docker build -t careerforge-backend .

# Run the container
docker run -p 8000:8000 careerforge-backend
```

### Docker Compose
```bash
# Start the entire stack
docker-compose up -d
```

### Manual Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and push to registry
docker build -t your-registry/careerforge-backend:latest .
docker push your-registry/careerforge-backend:latest

# Deploy to your server
docker run -d -p 8000:8000 your-registry/careerforge-backend:latest
```

### Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
heroku create careerforge-backend
git push heroku main
```

#### Railway
```bash
# Connect to Railway
railway login
railway init
railway up
```

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start "gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000" --name "careerforge-backend"
pm2 save
pm2 startup
```

## 📁 Project Structure

```
Backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── models.py              # Database models
├── schemas.py             # Pydantic schemas
├── auth.py                # Authentication logic
├── utils.py               # Utility functions
├── subscription_router.py # Subscription endpoints
├── payment_router.py      # Payment processing
├── skills_jobs_router.py  # Job matching logic
├── realtime_router.py     # Real-time features
├── voice_assistant.py     # Voice assistant
├── job_matcher.py         # Job matching algorithm
├── resume_parser_custom.py # Resume parsing
├── usage_tracker.py       # Usage tracking
├── paypal_webhook.py      # PayPal webhooks
├── uploads/               # File upload directory
├── __init__.py
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=sqlite:///./careerforge.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Monitoring
PROMETHEUS_MULTIPROC_DIR=/tmp
```

### API Endpoints

#### Authentication
- `POST /token` - Login and get access token
- `POST /signup` - User registration
- `POST /logout` - Logout and revoke token

#### Core Features
- `POST /api/chat` - AI chat functionality
- `POST /api/parse-resume` - Resume parsing
- `POST /api/job-match` - Job matching
- `GET /api/subscriptions` - Subscription plans
- `POST /api/subscriptions` - Upgrade subscription

#### Payment
- `POST /api/payment/create-checkout` - Create Stripe checkout
- `POST /api/payment/create-paypal-order` - Create PayPal order
- `POST /api/paypal-webhook` - PayPal webhook handler

#### Usage Tracking
- `POST /api/usage/track` - Track feature usage
- `GET /api/usage/check/{user_id}/{feature}` - Check usage limits
- `GET /api/usage/summary/{user_id}` - Get usage summary

## 🧪 Testing

```bash
# Run tests
python -m pytest

# Run with coverage
python -m pytest --cov=.

# Run specific test file
python -m pytest test_api.py -v
```

## 📊 API Documentation

The API documentation is automatically generated and available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔒 Security

- **CORS**: Configured for production domains
- **Rate Limiting**: Built-in rate limiting
- **Input Validation**: Pydantic schema validation
- **Authentication**: JWT token-based auth
- **File Upload**: Secure file handling
- **SQL Injection**: SQLAlchemy ORM protection
- **XSS Protection**: Input sanitization

## 📈 Monitoring

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health status

### Metrics
- Prometheus metrics available at `/metrics`
- Custom business metrics
- Performance monitoring

### Logging
- Structured logging with JSON format
- Log levels: DEBUG, INFO, WARNING, ERROR
- Log rotation and archiving

## 🔄 Updates

To update dependencies:

```bash
# Update all packages
pip install --upgrade -r requirements.txt

# Update specific packages
pip install --upgrade fastapi uvicorn

# Check for security vulnerabilities
pip-audit
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection issues**
   ```bash
   # Reinitialize database
   python init_db.py
   ```

3. **File upload issues**
   ```bash
   # Check uploads directory permissions
   chmod 755 uploads/
   ```

4. **Memory issues**
   ```bash
   # Increase worker memory
   gunicorn main:app -w 2 --max-requests 1000 --max-requests-jitter 100
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` endpoint
- **Issues**: Create an issue on GitHub
- **Email**: support@careerforge.ai

---

Built with ❤️ by the CareerForge AI team 