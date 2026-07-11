import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/client';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api
      .get(`/products?${params.toString()}`)
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <section className="section">
      <div className="products-layout">
        <aside className="filters">
          <h3>Categories</h3>
          <ul>
            <li>
              <button className={!category ? 'active' : ''} onClick={() => setSearchParams({ search })}>
                All
              </button>
            </li>
            {categories.map((c) => (
              <li key={c._id}>
                <button
                  className={category === c._id ? 'active' : ''}
                  onClick={() => setSearchParams({ search, category: c._id })}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="products-content">
          <h2>{search ? `Results for "${search}"` : 'All Products'}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
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
