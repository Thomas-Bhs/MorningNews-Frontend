/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ichef.bbci.co.uk',
      'media.guim.co.uk',
      'cdn.vox-cdn.com',
      'static01.nyt.com',
      'assets.bwbx.io',
      'www.aljazeera.com',
      'static.france24.com',
      'img.lemde.fr',
      'images.liberation.fr',
      'static.dw.com',
      'cdn.cnn.com',
      'media.cnn.com',
      'a.espncdn.com',
      'a1.espncdn.com',
      'a2.espncdn.com',
      'a3.espncdn.com',
      'a4.espncdn.com',
      'images.nationalgeographic.com',
      'www.independent.co.uk',
      'news.sky.com',
      'www.washingtonpost.com',
      'platform.theverge.com',
      '2.a7.org',
      'nypost.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
