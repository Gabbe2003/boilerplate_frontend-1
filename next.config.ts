

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
     value: "max-age=31536000; includeSubDomains; preload",
  }, 
  {
    key: "X-frame-Options", 
    // prevents a web page from being displayed in a frame, such as an <iframe>, <object>, or <embed>, on another website. 
    value: "DENY",
  }, 

]


const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || 'boiler.local';

const nextConfig = {
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
    { hostname: 'boilerplate.local', pathname: '/**' },
  ],
  contentDispositionType:"inline"
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
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  },}


module.exports = nextConfig;
  
