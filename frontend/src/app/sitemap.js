const BASE = 'https://dhruv-pooja-samagri.vercel.app';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap() {
  const staticUrls = ['', '/products', '/blog', '/kundli', '/kundli-matching', '/daily-horoscope'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
  }));

  let productUrls = [];
  try {
    const res = await fetch(`${API}/products?limit=1000`);
    if (res.ok) {
      const { products } = await res.json();
      productUrls = products.map((p) => ({
        url: `${BASE}/products/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
      }));
    }
  } catch {
    // sitemap still returns static URLs if the API is unreachable at build time
  }

  let blogUrls = [];
  try {
    const res = await fetch(`${API}/blog?limit=1000`);
    if (res.ok) {
      const { posts } = await res.json();
      blogUrls = posts.map((p) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
      }));
    }
  } catch {
    // sitemap still returns static URLs if the API is unreachable at build time
  }

  return [...staticUrls, ...productUrls, ...blogUrls];
}
