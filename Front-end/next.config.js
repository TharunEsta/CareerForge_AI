/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  // Allow external access for development
  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = nextConfig;
