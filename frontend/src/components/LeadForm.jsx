import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Loader from './Loader.jsx';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

/**
 * LeadForm — works in 'create' or 'edit' mode.
 * Props:
 *   mode        — 'create' | 'edit'
 *   initialData — pre-filled values for edit mode
 *   onSubmit    — async function(formData) → throws on error
 */
const LeadForm = ({ mode = 'create', initialData = {}, onSubmit, readOnly = false }) => {
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:    initialData.name    || '',
    email:   initialData.email   || '',
    phone:   initialData.phone   || '',
    company: initialData.company || '',
    status:  initialData.status  || 'New',
    notes:   initialData.notes   || '',
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!form.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    return newErrors;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      // Show server-side errors (e.g., duplicate email)
      const message = err.response?.data?.message || 'Something went wrong';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {/* Submit-level error (e.g., duplicate email from API) */}
      {errors.submit && (
        <div className="form-submit-error">
          <AlertCircle size={16} />
          <span>{errors.submit}</span>
        </div>
      )}

      <div className="form-grid">
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label required" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Jane Smith"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            disabled={readOnly}
          />
          {errors.name && (
            <span className="form-error">
              <AlertCircle size={12} /> {errors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label required" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="e.g. jane@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={readOnly}
          />
          {errors.email && (
            <span className="form-error">
              <AlertCircle size={12} /> {errors.email}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label required" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            disabled={readOnly}
          />
          {errors.phone && (
            <span className="form-error">
              <AlertCircle size={12} /> {errors.phone}
            </span>
          )}
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="form-label required" htmlFor="company">Company Name</label>
          <input
            id="company"
            name="company"
            type="text"
            className={`form-input ${errors.company ? 'error' : ''}`}
            placeholder="e.g. Acme Corporation"
            value={form.company}
            onChange={handleChange}
            autoComplete="organization"
            disabled={readOnly}
          />
          {errors.company && (
            <span className="form-error">
              <AlertCircle size={12} /> {errors.company}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label" htmlFor="status">Lead Status</label>
          <div className="select-wrapper">
            <select
              id="status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
              disabled={readOnly}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes — full width */}
        <div className="form-group form-group-full">
          <label className="form-label" htmlFor="notes">
            Notes <span className="optional-label">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="form-textarea"
            placeholder="Any additional notes about this lead..."
            value={form.notes}
            onChange={handleChange}
            maxLength={500}
            disabled={readOnly}
          />
          <span className="char-count">{form.notes.length}/500</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        {readOnly ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCancel}
            style={{ minWidth: '120px' }}
          >
            Close Details
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader inline /> : null}
              {loading
                ? mode === 'create' ? 'Creating...' : 'Saving...'
                : mode === 'create' ? 'Add Lead' : 'Save Changes'}
            </button>
          </>
        )}
      </div>

      <style>{`
        .lead-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-submit-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--color-danger-light);
          color: var(--color-danger);
          border: 1px solid #fecaca;
          border-radius: var(--radius-lg);
          font-size: 14px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group-full {
          grid-column: 1 / -1;
        }
        .optional-label {
          font-weight: 400;
          color: var(--color-text-muted);
          font-size: 12px;
        }
        .char-count {
          font-size: 11px;
          color: var(--color-text-muted);
          text-align: right;
          margin-top: 2px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--color-border);
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-actions {
            flex-direction: column-reverse;
          }
          .form-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
};

export default LeadForm;
