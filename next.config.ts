import type { NextConfig } from 'next';

const hostname: string = process.env.HOSTNAME ?? 'boiler.local';

const nextConfig: NextConfig = {
  env: {
    WP_GRAPHQL_URL:
      process.env.WP_GRAPHQL_URL ?? 'http://localhost:8888/graphql',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'newfinanstid.kinsta.cloud', // <-- Add this
        pathname: '/**',                      // <-- Allow all images
      },
      {
        pathname: '/**',
        hostname,
      },
      {
        hostname: `${process.env.NEXT_PUBLIC_SHARENAME! || 'boilerplate.local'}`,
        protocol: 'http',
      },
      {
        hostname: 'secure.gravatar.com',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
