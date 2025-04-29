import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       { // Allow images from fanutrition.pl for catalog covers
        protocol: 'https',
        hostname: 'fanutrition.pl',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config) => {
    // Required for react-pdf to work correctly with Next.js 13+ App Router
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
