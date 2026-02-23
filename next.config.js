const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'i.pravatar.cc'], // Cloudinary + Unsplash + Pravatar images
  },
  // Server Actions sont activés par défaut dans Next.js 14+
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  }
}

module.exports = withNextIntl(nextConfig)
