# CareerForge AI Environment Setup Guide

## Required Environment Variables

Create the following environment files in your project:

### Frontend (.env.local)
```bash
# NextAuth Configuration
NEXTAUTH_SECRET=eGkwj3N0w3+yFXD5hc8kG6ZywmOjH2LeTFYG/yW90sA=
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.careerforge.info
NEXT_PUBLIC_API_URL=https://api.careerforge.info
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=451537508210-ioomtdkriasc3tgq3t9qcbvlu3ladj67.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Email Configuration
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_USER=tharun.esta@careerforge.info
SMTP_PASS=2C87JBUSBVU7

# Frontend Configuration
NEXT_PUBLIC_ENABLE_VOICE_ASSISTANT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Development Settings
DEBUG=false
ENVIRONMENT=development
```

### Backend (.env.local)
```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_MODE=test

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/careerforge

# Security Settings
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_USER=tharun.esta@careerforge.info
SMTP_PASS=2C87JBUSBVU7

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Development Settings
DEBUG=false
ENVIRONMENT=development
```

## Configuration Steps

### 1. Razorpay Setup
1. Sign up for a Razorpay account at https://razorpay.com
2. Get your test API keys from the Razorpay dashboard
3. Replace `rzp_test_your_test_key_id` and `your_test_key_secret` with your actual Razorpay test keys
4. For production, use live keys and set `RAZORPAY_MODE=live`

### 2. Database Setup
1. Install PostgreSQL
2. Create a database named `careerforge`
3. Update the `DATABASE_URL` with your actual database credentials

### 3. Redis Setup
1. Install Redis
2. Start Redis server
3. Update `REDIS_URL` if using a different configuration

### 4. OpenAI Setup
1. Get an OpenAI API key from https://platform.openai.com
2. Replace `your-openai-api-key-here` with your actual OpenAI API key

### 5. Google OAuth Setup
1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (development)
   - https://yourdomain.com/api/auth/callback/google (production)

## Payment Configuration

### Current Pricing Structure
- **Free Plan**: ₹0/month
  - Access to GPT-4o mini and reasoning
  - Standard voice mode
  - Real-time data from the web with search
  - Limited access to GPT-4o and o4-mini
  - Limited access to file uploads, advanced data analysis, and image generation
  - Use custom GPTs

- **Plus Plan**: ₹599/month
  - Everything in Free
  - Extended limits on messaging, file uploads, advanced data analysis, and image generation
  - Standard and advanced voice mode
  - Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5
  - Create and use tasks, projects, and custom GPTs
  - Limited access to Sora video generation
  - Opportunities to test new features

- **Pro Plan**: ₹1399/month
  - Everything in Plus
  - Unlimited access to all reasoning models and GPT-4o
  - Unlimited access to advanced voice
  - Extended access to deep research, which conducts multi-step online research for complex tasks
  - Access to research previews of GPT-4.5 and Operator
  - Access to o3 pro mode, which uses more compute for the best answers to the hardest questions
  - Extended access to Sora video generation

- **Business Plan**: ₹1999/month
  - Everything in Pro
  - Team management and collaboration tools
  - Advanced security and compliance
  - Priority support
  - Custom integrations
  - Enterprise-grade analytics

### Payment Methods Supported
- UPI (Google Pay, PhonePe, Paytm)
- Net Banking
- Credit/Debit Cards
- Digital Wallets (Paytm, PhonePe)

## Security Notes

1. **Never commit .env files to version control**
2. **Use strong, unique secrets in production**
3. **Rotate API keys regularly**
4. **Use HTTPS in production**
5. **Implement proper rate limiting**

## Troubleshooting

### Common Issues

1. **Payment Gateway Errors**
   - Check Razorpay credentials
   - Verify webhook URLs are accessible
   - Ensure proper SSL certificates in production

2. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check redirect URIs match exactly
   - Ensure NEXTAUTH_SECRET is set

3. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

4. **Email Configuration**
   - Verify SMTP credentials
   - Check firewall settings
   - Test email sending functionality

## Production Deployment

1. **Environment Variables**
   - Use production API keys
   - Set `ENVIRONMENT=production`
   - Use strong secrets
   - Enable HTTPS

2. **Database**
   - Use managed PostgreSQL service
   - Set up proper backups
   - Configure connection pooling

3. **Security**
   - Enable CORS properly
   - Set up rate limiting
   - Use secure headers
   - Implement proper logging

4. **Monitoring**
   - Set up application monitoring
   - Configure error tracking
   - Monitor payment webhooks
   - Track usage analytics 