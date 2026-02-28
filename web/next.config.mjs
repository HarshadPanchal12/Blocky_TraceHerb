/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  output: 'standalone',
  experimental: {
    webpackBuildWorker: true
  },
};

export default nextConfig;
