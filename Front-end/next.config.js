/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Allow external access for development
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = nextConfig;
