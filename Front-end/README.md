# CareerForge AI Frontend

A modern, production-ready Next.js 14 frontend for CareerForge AI - an AI-powered career optimization platform.

## 🚀 Features

- **Modern UI**: Dark theme with Perplexity-style interface
- **Responsive Design**: Fully responsive across all devices
- **Real-time Chat**: AI-powered career assistant with streaming responses
- **Resume Analysis**: Upload and analyze resumes for ATS optimization
- **Job Matching**: Find relevant job opportunities based on skills
- **Subscription Management**: Free, Plus, and Pro plans
- **Authentication**: User account management and security
- **Command Palette**: Quick navigation with ⌘K shortcut
- **Animations**: Smooth Framer Motion animations throughout

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **UI Components**: shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Themes**: next-themes for dark/light mode

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Building for Production

### Local Build
```bash
npm run build
npm start
```

### Docker Build
```bash
# Build the Docker image
docker build -t careerforge-frontend .

# Run the container
docker run -p 3000:3000 careerforge-frontend
```

### Docker Compose
```bash
# Start the entire stack
docker-compose up -d
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment
```bash
# Build and push to registry
docker build -t your-registry/careerforge-frontend:latest .
docker push your-registry/careerforge-frontend:latest

# Deploy to your server
docker run -d -p 3000:3000 your-registry/careerforge-frontend:latest
```

### PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "careerforge-frontend" -- start
pm2 save
pm2 startup
```

## 📁 Project Structure

```
Front-end/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── pricing/           # Pricing page
│   ├── settings/          # Settings page
│   ├── help/              # Help page
│   ├── account/           # Account page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── ChatBar.tsx       # Chat input component
│   ├── SplashScreen.tsx  # Loading screen
│   └── ErrorBoundary.tsx # Error handling
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── styles/               # Global styles
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# API Keys
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE_ASSISTANT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### API Endpoints

The frontend expects the following API endpoints:

- `POST /api/chat` - AI chat functionality
- `POST /api/parse-resume` - Resume parsing
- `POST /api/job-match` - Job matching
- `GET /api/subscriptions` - Subscription plans
- `POST /api/subscriptions` - Upgrade subscription

## 🎨 Customization

### Themes
The app uses a dark theme by default. To customize:

1. Edit `tailwind.config.ts` for color schemes
2. Modify `components/ui/` for component styling
3. Update theme variables in `globals.css`

### Components
All components are built with shadcn/ui and can be customized:

```bash
# Add new components
npx shadcn@latest add button
npx shadcn@latest add dialog
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (if configured)
npm test
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with Next.js tree shaking
- **Images**: Optimized with Next.js Image component
- **Fonts**: Optimized with Next.js font optimization

## 🔒 Security

- **CORS**: Configured for production domains
- **CSP**: Content Security Policy headers
- **Authentication**: Secure session management
- **Input Validation**: Zod schema validation
- **XSS Protection**: React's built-in XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/help` page in the app
- **Issues**: Create an issue on GitHub
- **Email**: support@careerforge.ai

## 🔄 Updates

To update dependencies:

```bash
# Update all dependencies
npm update

# Update specific packages
npm update framer-motion lucide-react

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

Built with ❤️ by the CareerForge AI team 