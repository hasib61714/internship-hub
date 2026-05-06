const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internhub.vercel.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/jobs', '/jobs/'],
        disallow: ['/student/', '/company/', '/admin/', '/login', '/register'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
