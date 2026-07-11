'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

function Stars({ value }) {
  return (
    <span className="review-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fa-solid fa-star ${i < Math.round(value) ? 'filled' : ''}`} />
      ))}
    </span>
  );
}

export default function ProductReviews({ slug, ratingAverage, ratingCount }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get(`/products/${slug}/reviews`).then((res) => {
      setReviews(res.data);
      setLoading(false);
    });
  }

  useEffect(load, [slug]);

  const alreadyReviewed = user && reviews.some((r) => r.user === user.id || r.user === user._id);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/products/${slug}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section product-reviews">
      <h2>Customer Reviews</h2>

      <div className="review-summary">
        <div className="review-summary-score">{ratingAverage?.toFixed(1) || '0.0'}</div>
        <div>
          <Stars value={ratingAverage || 0} />
          <p>{ratingCount || 0} review{ratingCount === 1 ? '' : 's'}</p>
        </div>
      </div>

      {user && !alreadyReviewed && (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Your Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </label>
          <textarea
            placeholder="Share your experience with this product..."
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
      {!user && <p className="review-login-hint">Login to write a review for this product.</p>}

      {!loading && reviews.length === 0 && <p>No reviews yet. Be the first to review this product.</p>}

      <div className="review-list">
        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-item-header">
              <strong>{r.name}</strong>
              <Stars value={r.rating} />
            </div>
            <p>{r.comment}</p>
            <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
