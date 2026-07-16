import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', roles: ['admin', 'staff'] },
  { to: '/products', label: 'Products', roles: ['admin', 'staff'] },
  { to: '/categories', label: 'Categories', roles: ['admin'] },
  { to: '/orders', label: 'Orders', roles: ['admin', 'staff'] },
  { to: '/customers', label: 'Customers', roles: ['admin', 'staff'] },
  { to: '/subscribers', label: 'Subscribers', roles: ['admin', 'staff'] },
  { to: '/blog', label: 'Blog', roles: ['admin', 'staff'] },
  { to: '/coupons', label: 'Coupons', roles: ['admin'] },
  { to: '/activity-logs', label: 'Activity Logs', roles: ['admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      <button className="admin-menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <h2 className="brand">Vasishtha Admin</h2>
        <nav>
          {links
            .filter((l) => l.roles.includes(user.role))
            .map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">
          <p>{user.name}</p>
          <span className="role-badge">{user.role}</span>
          <button className="link-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {menuOpen && <div className="admin-menu-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
