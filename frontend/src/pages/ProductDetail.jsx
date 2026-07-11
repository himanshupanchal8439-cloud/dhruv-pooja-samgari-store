import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => {
      setProduct(res.data);
      setActiveIndex(0);
    });
  }, [slug]);

  useEffect(() => {
    if (!previewOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') setPreviewOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previewOpen]);

  if (!product) return <p className="section">Loading...</p>;

  const images = product.images?.length ? product.images : ['https://loremflickr.com/500/500/puja'];
  const videos = product.videos || [];
  const media = [...images.map((url) => ({ type: 'image', url })), ...videos.map((url) => ({ type: 'video', url }))];
  const active = media[activeIndex] || media[0];

  return (
    <section className="section product-detail">
      <div className="product-gallery">
        {active.type === 'video' ? (
          <video className="product-detail-image" src={active.url} controls />
        ) : (
          <img
            className="product-detail-image"
            src={active.url}
            alt={product.name}
            onClick={() => setPreviewOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setPreviewOpen(true)}
          />
        )}

        {media.length > 1 && (
          <div className="product-thumbnails">
            {media.map((m, i) => (
              <button
                key={m.url + i}
                className={`product-thumb ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`View ${m.type} ${i + 1}`}
              >
                {m.type === 'video' ? (
                  <>
                    <video src={m.url} muted />
                    <span className="product-thumb-play">▶</span>
                  </>
                ) : (
                  <img src={m.url} alt={`${product.name} ${i + 1}`} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {product.compareAtPrice > product.price && <span className="mrp">₹{product.compareAtPrice}</span>}
        </div>
        {product.stock <= 0 && <span className="out-of-stock">Out of Stock</span>}
        <p>{product.description}</p>

        {product.variants?.length > 0 && (
          <select className="variant-select" onChange={(e) => setVariant(JSON.parse(e.target.value))}>
            <option value="">Select Variant</option>
            {product.variants.map((v, i) => (
              <option key={i} value={JSON.stringify(v)}>
                {v.size} {v.color}
              </option>
            ))}
          </select>
        )}

        <div className="qty-select">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <div className="product-detail-actions">
          <button className="btn-primary" disabled={product.stock <= 0} onClick={() => addItem(product, quantity, variant)}>
            Add to Cart
          </button>
          <button
            className="btn-buy-now"
            disabled={product.stock <= 0}
            onClick={() => {
              addItem(product, quantity, variant);
              navigate('/checkout');
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {previewOpen && active.type === 'image' && (
        <div className="image-preview-overlay" onClick={() => setPreviewOpen(false)}>
          <button className="image-preview-close" onClick={() => setPreviewOpen(false)} aria-label="Close preview">
            ✕
          </button>
          <img src={active.url} alt={product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
