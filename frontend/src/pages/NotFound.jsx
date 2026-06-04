import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

/**
 * NotFound — 404 page with a back to dashboard button.
 */
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <AlertCircle size={48} />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary" id="not-found-home-btn">
          <Home size={16} /> Back to Dashboard
        </Link>
      </div>

      <style>{`
        .not-found-page {
          min-height: calc(100vh - var(--navbar-height));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }
        .not-found-content {
          text-align: center;
          max-width: 420px;
        }
        .not-found-icon {
          width: 80px;
          height: 80px;
          background: var(--color-accent-light);
          color: var(--color-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .not-found-code {
          font-size: 72px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .not-found-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }
        .not-found-desc {
          font-size: 15px;
          color: var(--color-text-secondary);
          margin-bottom: 32px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
