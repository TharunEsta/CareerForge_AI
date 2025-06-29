/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow external access for development
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = nextConfig;
