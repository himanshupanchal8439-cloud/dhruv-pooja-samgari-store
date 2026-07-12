import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import T from '../../components/T';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ searchParams }) {
  const { search } = await searchParams;
  return { title: search ? `Search: ${search}` : 'Shop Puja Samagri Online' };
}

async function getCategories() {
  const res = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

async function getProducts(search, category) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  const res = await fetch(`${API}/products?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products;
}

export default async function Products({ searchParams }) {
  const { search = '', category = '' } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts(search, category)]);

  return (
    <section className="section">
      <div className="products-layout">
        <aside className="filters">
          <h3>
            <T k="categories" />
          </h3>
          <ul>
            <li>
              <Link href={`/products${search ? `?search=${search}` : ''}`} className={!category ? 'active' : ''}>
                <T k="all" />
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c._id}>
                <Link
                  href={`/products?${search ? `search=${search}&` : ''}category=${c._id}`}
                  className={category === c._id ? 'active' : ''}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="products-content">
          <h2>
            {search ? (
              <>
                <T k="resultsFor" /> "{search}"
              </>
            ) : (
              <T k="allProducts" />
            )}
          </h2>
          {products.length === 0 ? (
            <p>
              <T k="noProducts" />
            </p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
