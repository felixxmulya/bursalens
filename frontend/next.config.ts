import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['127.0.0.1'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
