import GaneshaHero from '../components/GaneshaHero';
import HomeSections from '../components/HomeSections';
import AstrologySection from '../components/AstrologySection';
import PanchangSection from '../components/PanchangSection';
import AwardsSection from '../components/AwardsSection';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getCategories() {
  const res = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

async function getProducts() {
  const res = await fetch(`${API}/products?limit=8`, { next: { revalidate: 300 } });
  if (!res.ok) return { products: [] };
  return res.json();
}

export default async function Home() {
  const [categories, { products }] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <GaneshaHero />
      <HomeSections categories={categories} products={products} />
      <AstrologySection />
      <PanchangSection />
      <AwardsSection />
    </>
  );
}
