// next.config.ts
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
        pathname: "/**",
        hostname,
      },
      {
        hostname: "boilerplate.local", 
        protocol: "http",
      }, {
        hostname: "secure.gravatar.com",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;
