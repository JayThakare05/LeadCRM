import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Plus, Menu, X } from 'lucide-react';

/**
 * Navbar — app logo on left, nav links on right.
 * Responsive: hamburger menu on mobile (≤ 768px).
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <BarChart3 size={18} />
          </div>
          <span className="logo-text">LeadCRM</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links hide-mobile">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              id="nav-dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/add"
              className="btn btn-primary nav-add-btn"
              id="nav-add-lead"
            >
              <Plus size={16} /> Add Lead
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="hamburger hide-desktop"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu hide-desktop">
          <Link
            to="/"
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
            id="mobile-nav-dashboard"
          >
            Dashboard
          </Link>
          <Link
            to="/add"
            className="mobile-nav-link accent"
            onClick={closeMenu}
            id="mobile-nav-add-lead"
          >
            <Plus size={16} /> Add Lead
          </Link>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--navbar-height);
          background: var(--color-bg-primary);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          z-index: 100;
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--color-text-primary);
        }
        .logo-icon {
          width: 34px;
          height: 34px;
          background: var(--color-accent);
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--color-text-primary);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
        }
        .nav-link {
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-hover);
        }
        .nav-link.active {
          color: var(--color-accent);
          background: var(--color-accent-light);
        }
        .nav-add-btn {
          padding: 7px 16px;
          font-size: 14px;
        }
        .hamburger {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-primary);
          padding: 6px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          transition: var(--transition);
        }
        .hamburger:hover {
          background: var(--color-bg-hover);
        }
        .mobile-menu {
          background: var(--color-bg-primary);
          border-top: 1px solid var(--color-border);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .mobile-nav-link:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
        }
        .mobile-nav-link.active {
          color: var(--color-accent);
          background: var(--color-accent-light);
        }
        .mobile-nav-link.accent {
          color: var(--color-accent);
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
