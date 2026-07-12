import { notFound } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPost(slug) {
  const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || post.title;
  const url = `/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const translation = post.translationSlug ? await getPost(post.translationSlug) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    inLanguage: post.language,
    publisher: { '@type': 'Organization', name: 'Vasishth Pooja Samagri Store' },
  };

  return (
    <article className="section blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {translation && (
        <Link href={`/blog/${translation.slug}`} className="blog-translation-link">
          {translation.language === 'hi' ? 'हिंदी में पढ़ें' : 'Read in English'}
        </Link>
      )}

      <h1>{post.title}</h1>
      {post.coverImage && <img className="blog-post-cover" src={post.coverImage} alt={post.title} />}

      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="blog-post-footer">
        <Link href="/blog" className="btn-primary">
          ← More Guides
        </Link>
        <Link href="/products" className="btn-buy-now">
          Shop Puja Samagri
        </Link>
      </div>
    </article>
  );
}
