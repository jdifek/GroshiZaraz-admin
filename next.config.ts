import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['play-lh.googleusercontent.com'],
  },
  typescript: {
    ignoreBuildErrors: true, // <- деплой даже при TS-ошибках
  },
};

export default nextConfig;
