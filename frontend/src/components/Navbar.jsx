import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Navbar — Logo on left, Logout button on right.
 * No navigation links — user uses the Add Lead button in Dashboard instead.
 */

/**
 * Inline CRM Icon for Navbar
 */
const NavCRMIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="28" width="8" height="16" rx="2" fill="#fff" opacity="0.9"/>
    <rect x="16" y="18" width="8" height="26" rx="2" fill="#fff"/>
    <rect x="28" y="10" width="8" height="34" rx="2" fill="#fff" opacity="0.9"/>
    <path d="M40 8 L44 4 M44 4 L44 10 M44 4 L38 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 26 L18 16 L30 8 L42 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <NavCRMIcon />
          </div>
          <span className="logo-text">LeadCRM</span>
        </Link>

        {/* Right side: username + logout */}
        <div className="navbar-right hide-mobile">
          {user && (
            <span className="navbar-username">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.6 }}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {user.username}
            </span>
          )}
          <button
            className="btn btn-logout"
            onClick={handleLogout}
            id="navbar-logout-btn"
            aria-label="Log out"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger hide-desktop"
          onClick={() => setMenuOpen(p => !p)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu hide-desktop">
          {user && (
            <div className="mobile-username">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {user.username}
            </div>
          )}
          <button
            className="mobile-logout-btn"
            onClick={() => { setMenuOpen(false); handleLogout(); }}
          >
            <LogOut size={15} /> Log Out
          </button>
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
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(79,70,229,0.3);
        }
        .logo-text {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--color-text-primary);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-username {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 5px 10px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }
        .btn-logout {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          font-family: var(--font-family);
          font-size: 13px;
          font-weight: 500;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-logout:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          transform: translateY(-1px);
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
        .hamburger:hover { background: var(--color-bg-hover); }
        .mobile-menu {
          background: var(--color-bg-primary);
          border-top: 1px solid var(--color-border);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-username {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
        }
        .mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-family);
          transition: var(--transition);
        }
        .mobile-logout-btn:hover { background: #fee2e2; }
      `}</style>
    </nav>
  );
};

export default Navbar;
