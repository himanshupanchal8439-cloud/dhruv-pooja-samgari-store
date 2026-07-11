import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="footer-brand">Dhruv Pooja Samagri</h2>
            <p>
              Bringing ancient traditions to your doorstep. Ethically sourced, spiritually curated, and delivered
              with devotion.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-twitter" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Sacred Collections</h4>
            <ul>
              <li>
                <Link to="/products">Temple Idols</Link>
              </li>
              <li>
                <Link to="/products">Rudraksha Malas</Link>
              </li>
              <li>
                <Link to="/products">Divine Samagri</Link>
              </li>
              <li>
                <Link to="/products">Astrology Services</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/account/orders">Track Order</Link>
              </li>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Spiritual Insights</h4>
            <p>Subscribe for Vedic wisdom and exclusive store offers.</p>
            <form className="footer-newsletter" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Dhruv Pooja Samagri Store. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
