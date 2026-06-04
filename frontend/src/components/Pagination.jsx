import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination — Previous/Next buttons + page number buttons (max 5 visible).
 * Shows "Showing X to Y of Z leads" result count.
 */
const Pagination = ({ pagination, onPageChange, limit = 10 }) => {
  const { currentPage, totalPages, totalLeads } = pagination;

  if (totalPages <= 1 && totalLeads <= limit) return null;

  // ── Calculate visible page range (max 5 buttons) ──────────────────────────
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    return range;
  };

  // ── Result count display ──────────────────────────────────────────────────
  const from = Math.min((currentPage - 1) * limit + 1, totalLeads);
  const to   = Math.min(currentPage * limit, totalLeads);

  const pageRange = getPageRange();

  return (
    <div className="pagination-wrapper">
      <span className="pagination-info">
        Showing <strong>{from}</strong> to <strong>{to}</strong> of{' '}
        <strong>{totalLeads}</strong> lead{totalLeads !== 1 ? 's' : ''}
      </span>

      <div className="pagination-controls">
        {/* Previous */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Show first page with ellipsis if needed */}
        {pageRange[0] > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
            {pageRange[0] > 2 && <span className="pagination-ellipsis">…</span>}
          </>
        )}

        {/* Page number buttons */}
        {pageRange.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Show last page with ellipsis if needed */}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">…</span>
            )}
            <button
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <style>{`
        .pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
          gap: 12px;
        }
        .pagination-info {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pagination-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-family);
          color: var(--color-text-secondary);
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .pagination-btn:hover:not(:disabled) {
          background: var(--color-accent-light);
          color: var(--color-accent);
          border-color: var(--color-accent);
        }
        .pagination-btn.active {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }
        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-ellipsis {
          font-size: 13px;
          color: var(--color-text-muted);
          padding: 0 4px;
        }
        @media (max-width: 480px) {
          .pagination-wrapper {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;
