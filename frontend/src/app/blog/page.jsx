import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const metadata = {
  title: 'Blog - Puja Vidhi, Festival Guides & Rituals',
  description:
    'Read guides on puja vidhi, festival rituals, griha pravesh samagri lists and more from Vashishtha Spiritual Store.',
};

async function getPosts() {
  const res = await fetch(`${API}/blog?limit=50`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.posts;
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <section className="section blog-page">
      <div className="sacred-heading">
        <h2>Puja Guides &amp; Festival Wisdom</h2>
        <div className="sacred-divider" />
      </div>

      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        <div className="blog-grid">
          {posts.map((p) => (
            <Link key={p._id} href={`/blog/${p.slug}`} className="blog-card">
              {p.coverImage && <img src={p.coverImage} alt={p.title} loading="lazy" />}
              <div className="blog-card-body">
                <span className="blog-card-lang">{p.language === 'hi' ? 'हिंदी' : 'English'}</span>
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
