import { notFound } from 'next/navigation';
import ProductDetailClient from '../../../components/ProductDetailClient';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getProduct(slug) {
  const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const image = product.images?.[0];
  const url = `/products/${slug}`;
  const description = product.description?.slice(0, 160) || `Buy ${product.name} online at Dhruv Pooja Samagri Store.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
