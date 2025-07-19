/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Configure for preview environment
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Allow framing from same origin for preview
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow CORS for preview environment
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/chat',
        destination: '/',
        permanent: false,
      },
    ];
  },
  // Configure webpack for better hot reloading and preview compatibility
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve hot reloading reliability for preview environment
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };

      // Ensure proper module resolution
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Development server configuration - clean config for stability
  output: 'standalone',
};

module.exports = nextConfig;
