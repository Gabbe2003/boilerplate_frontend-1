import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL!;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/wp-admin/',
          '/wp-login.php',
          '/xmlrpc.php',
          '/cgi-bin/',
          '/search/',
          '/*?q=',
        ],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
  };
}
