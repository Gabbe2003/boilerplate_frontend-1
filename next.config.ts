/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || 'boiler.local';
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'boilerplate.local';

const nextConfig = {
  env: {
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL || 'http://localhost:3000/graphql',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'track.adtraction.com',
        pathname: '/t/**',
      },
      {
        protocol: 'https',
        hostname: 'newfinanstid.kinsta.cloud',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'staging6.finanstidning.se',
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
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/full_logo_with_slogan.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/full_logo_with_slogan.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
