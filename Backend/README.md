# CareerForge AI Backend

A comprehensive AI-powered career platform backend built with FastAPI, featuring advanced resume parsing, job matching, and real-time payment processing.

## 🚀 Features

- **AI-Powered Resume Parsing**: Advanced resume analysis and optimization
- **Smart Job Matching**: AI-driven job recommendations based on skills and experience
- **Real-time Chat**: Interactive AI chat for career guidance
- **Voice Assistant**: Speech-to-text and text-to-speech capabilities
- **Payment Processing**: Razorpay integration with UPI, cards, net banking
- **Subscription Management**: Flexible subscription plans with usage tracking
- **Real-time Features**: WebSocket support for live updates
- **File Upload**: Secure file handling for resumes and documents

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: JWT tokens
- **Payment**: Razorpay integration
- **AI/ML**: OpenAI GPT models
- **Real-time**: WebSocket support
- **Caching**: Redis
- **Monitoring**: Prometheus metrics

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL
- Redis
- Razorpay account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareerForge_AI/Backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   python init_db.py
   ```

5. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

## 🔐 Environment Variables

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

# Payment Processing - Razorpay Only
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_MODE=test

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

## 📚 API Endpoints

### Authentication
- `POST /token` - Login and get access token
- `POST /signup` - User registration
- `POST /logout` - Logout and revoke token

### Core Features
- `POST /api/chat` - AI chat functionality
- `POST /api/parse-resume` - Resume parsing
- `POST /api/job-match` - Job matching
- `GET /api/subscriptions` - Subscription plans
- `POST /api/subscriptions` - Upgrade subscription

### Payment (Razorpay Only)
- `POST /api/payment/create` - Create payment order
- `POST /api/payment/verify` - Verify payment signature
- `GET /api/payment/status/{payment_id}` - Get payment status
- `POST /api/payment/webhook/razorpay` - Razorpay webhook handler
- `GET /api/payment/gateways` - Get available payment gateways
- `GET /api/payment/methods` - Get supported payment methods

### Real-time Features
- `GET /api/realtime/ws` - WebSocket connection
- `POST /api/realtime/broadcast` - Broadcast message

### Voice Assistant
- `POST /api/voice-assistant/chat` - Voice chat
- `POST /api/voice-assistant/subscribe` - Voice assistant subscription

## 💳 Payment Features

### Supported Payment Methods
- **UPI**: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
- **Credit/Debit Cards**: Visa, Mastercard, RuPay, American Express
- **Net Banking**: HDFC, ICICI, SBI, Axis, Kotak, Yes Bank
- **Digital Wallets**: Paytm, PhonePe, Amazon Pay, Mobikwik
- **EMI**: No cost EMI with flexible tenure

### Real-time Features
- QR code generation for UPI payments
- Real-time payment status tracking
- Automatic payment verification
- Secure webhook processing
- Payment expiration handling

## 📊 Subscription Plans

### Free Plan (₹0/month)
- 3 Resume Analysis per month
- Basic AI chat (5 per month)
- Community support
- Basic job matching (3 per month)

### Plus Plan (₹599/month)
- Resume Analysis + Rewriting (45 times)
- Cover Letter Generation (45 times)
- Job Matching (50 times per month)
- Image Generation (20 times)
- Voice Assistant (50 times)
- Advanced AI chat (100 per month)
- Email support

### Pro Plan (₹1399/month)
- Everything in Plus
- Unlimited access to all features
- Priority support
- Advanced voice assistant

### Business Plan (₹1999/month)
- Everything in Pro
- Team Management
- Advanced Security & Compliance
- Priority Support
- Custom Integrations
- Enterprise Analytics

## 🔒 Security

- JWT-based authentication
- Secure payment processing with Razorpay
- Webhook signature verification
- Rate limiting
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Set up PostgreSQL and Redis
2. Configure environment variables
3. Run database migrations
4. Start the application with uvicorn

## 📈 Monitoring

- Prometheus metrics endpoint: `/metrics`
- Health check endpoint: `/health`
- Payment status monitoring
- Usage tracking and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@careerforge.ai or create an issue in the repository. 