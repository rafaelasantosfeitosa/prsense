/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prsense/shared'],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
