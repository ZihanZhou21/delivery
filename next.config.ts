import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  // 移除 output: 'export'，因为它会阻止API路由工作
  // basePath: '/delivery',
  // assetPrefix: '/delivery/',
}

export default nextConfig
