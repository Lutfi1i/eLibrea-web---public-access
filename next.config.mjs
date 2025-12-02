/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '2124',
        pathname: '/uploads/**',
      },
    ],
    // Atau gunakan domains (deprecated tapi masih work)
    domains: ['localhost'],
  },
};
/* config options here */
export default nextConfig;
