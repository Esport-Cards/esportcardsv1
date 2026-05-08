/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['cdn.pixabay.com', 'images.unsplash.com', 'img.icons8.com'],
  },
};

module.exports = nextConfig;
