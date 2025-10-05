import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
    turbopack: {
      root: '.',
    },
  },
  
  // سنصلح الأخطاء بدلاً من تجاهلها
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  
  // تحسين الأداء والصور
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '3001',
        pathname: '/uploads/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // تحسين الأداء
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // تحسين البيئة
  compress: true,
};

export default nextConfig;
