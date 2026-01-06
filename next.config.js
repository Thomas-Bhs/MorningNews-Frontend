/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.vox-cdn.com'],
    domains: ['techcrunch.com'],
  },
};

module.exports = nextConfig;
