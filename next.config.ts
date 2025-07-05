// next.config.ts
import type { NextConfig } from 'next';

const protocol: 'http' | 'https' =
  process.env.NODE_ENV === 'development' ? 'https' : 'https';

// HERE: ensure hostname is a string
const hostname: string = process.env.HOSTNAME ?? 'boiler.local';

const nextConfig: NextConfig = {
  env: {
    WP_GRAPHQL_URL:
      process.env.WP_GRAPHQL_URL ?? 'http://localhost:8888/graphql',
  },
  images: {
    remotePatterns: [
      {
        protocol,
        hostname,
      },
    ],
  },
};

export default nextConfig;
