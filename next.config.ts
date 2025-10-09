import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'i.pinimg.com',
      'images.unsplash.com',
      'randomuser.me',
      'global-web-assets.cpcdn.com',
      'res.cloudinary.com', // Added Cloudinary domain for uploaded images
    ],
  },
};

export default nextConfig;
