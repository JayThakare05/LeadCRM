import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmModal — delete confirmation popup.
 * Clicking the overlay or pressing Escape closes the modal.
 * Props:
 *   leadName  — name of the lead being deleted
 *   onConfirm — callback on confirm
 *   onCancel  — callback on cancel / overlay click
 */
const ConfirmModal = ({ leadName, onConfirm, onCancel }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Stop clicks inside modal from closing it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>
        <h2 className="confirm-title" id="confirm-modal-title">Delete Lead</h2>
        <p className="confirm-desc">
          Are you sure you want to delete{' '}
          <strong>{leadName}</strong>?{' '}
          This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            id="modal-cancel-btn"
            autoFocus
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            id="modal-delete-btn"
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        .confirm-icon {
          width: 56px;
          height: 56px;
          background: var(--color-danger-light);
          color: var(--color-danger);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .confirm-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary);
          text-align: center;
          margin-bottom: 8px;
        }
        .confirm-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          text-align: center;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .confirm-actions .btn {
          flex: 1;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
