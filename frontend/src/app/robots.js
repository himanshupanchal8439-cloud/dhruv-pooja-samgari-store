export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/account/', '/login', '/register'],
    },
    sitemap: 'https://dhruv-pooja-samagri.vercel.app/sitemap.xml',
  };
}
