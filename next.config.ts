/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Resolve envs to plain strings first (no TS types here)
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || 'boiler.local';
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'boilerplate.local';

const nextConfig = {
  env: {
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL || 'http://localhost:3000G/graphql',
  },
  images: {
    remotePatterns: [
      // Ad images
      {
        protocol: 'https',
        hostname: 'track.adtraction.com',
        pathname: '/t/**',
      },
      // Your site(s)
      {
        protocol: 'https',
        hostname: 'newfinanstid.kinsta.cloud',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: HOSTNAME,
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: HOST_URL,
        pathname: '/**',
      },
      // Gravatar
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
