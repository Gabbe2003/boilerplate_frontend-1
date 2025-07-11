import type { NextConfig } from 'next';

const protocol: 'http' | 'https' =
  process.env.NODE_ENV === 'development' ? 'http' : 'https';

// Extract hostname from NEXT_PUBLIC_SHARENAME
let shareHost = 'boiler.local';
if (process.env.NEXT_PUBLIC_SHARENAME) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SHARENAME);
    shareHost = url.hostname;
  } catch {
    shareHost = process.env.NEXT_PUBLIC_SHARENAME;
  }
}

const nextConfig: NextConfig = {
  env: {
    WP_GRAPHQL_URL:
      process.env.WP_GRAPHQL_URL ?? 'http://localhost:8888/graphql',
  },
  images: {
    remotePatterns: [
      {
        protocol,
        hostname: shareHost,
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com', // Allow author avatars from Gravatar
      },
    ],
  },
};

export default nextConfig;
