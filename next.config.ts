/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || 'boiler.local';

const nextConfig = {
  // Only embed build-time constants you’re okay shipping to the client.
  // Prefer reading process.env.* at runtime on the server where possible.
  env: {
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL || 'http://localhost:3000/graphql',
  },

// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'track.adtraction.com', pathname: '/t/**' },
    { protocol: 'https', hostname: 'newfinanstid.kinsta.cloud', pathname: '/**' },
    { protocol: 'https', hostname: 'cms.finanstidning.se', pathname: '/**' },
    { protocol: 'https', hostname: 'staging6.finanstidning.se', pathname: '/**' }, // ⬅ add this
    { protocol: 'https', hostname: HOSTNAME, pathname: '/**' },
    { protocol: 'https', hostname: 'secure.gravatar.com', pathname: '/**' },
  ],
},


  async headers() {
    return [
      {
        source: '/full_logo_with_slogan.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
