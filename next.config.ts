import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      domains: ["res.cloudinary.com"],
      // Or use remotePatterns (recommended):
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
          },
      ],
  },
  experimental: {
      serverActions: {
          bodySizeLimit: '10mb'
      }
  }
};

export default nextConfig;
