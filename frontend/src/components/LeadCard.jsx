import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * LeadCard — mobile card view (visible ≤ 768px).
 * Shows all lead details in a card layout with badge top-right.
 * Props:
 *   lead     — lead object
 *   onDelete — callback(lead) — opens confirm modal
 */
const LeadCard = ({ lead, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const leadCreatorId = lead.createdBy?._id || lead.createdBy;
  const currentUserId = user?.id || user?._id;
  const canModify = currentUserId && leadCreatorId && leadCreatorId.toString() === currentUserId.toString();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  return (
    <div className="lead-card card">
      {/* Card Header */}
      <div className="lead-card-header">
        <div className="lead-card-avatar">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="lead-card-info">
          <h3 className="lead-card-name">{lead.name}</h3>
          <p className="lead-card-company">
            <Building2 size={12} /> {lead.company}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {/* Card Body */}
      <div className="lead-card-body">
        <div className="lead-card-row">
          <Mail size={14} />
          <a className="lead-card-link" href={`mailto:${lead.email}`}>
            {lead.email}
          </a>
        </div>
        <div className="lead-card-row">
          <Phone size={14} />
          <a className="lead-card-link" href={`tel:${lead.phone}`}>
            {lead.phone}
          </a>
        </div>
        {lead.notes && (
          <p className="lead-card-notes">{lead.notes}</p>
        )}
        <p className="lead-card-date">Added {formatDate(lead.createdAt)}</p>
      </div>

      {/* Card Footer */}
      {canModify && (
        <div className="lead-card-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/edit/${lead._id}`)}
            aria-label={`Edit ${lead.name}`}
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(lead)}
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      <style>{`
        .lead-card {
          padding: 16px;
          transition: var(--transition);
        }
        .lead-card:hover {
          box-shadow: var(--shadow-md);
        }
        .lead-card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .lead-card-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-accent-light);
          color: var(--color-accent);
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .lead-card-info {
          flex: 1;
          min-width: 0;
        }
        .lead-card-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lead-card-company {
          font-size: 12px;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .lead-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
        }
        .lead-card-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-secondary);
          font-size: 13px;
        }
        .lead-card-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lead-card-link:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }
        .lead-card-notes {
          font-size: 12px;
          color: var(--color-text-muted);
          font-style: italic;
          background: var(--color-bg-secondary);
          padding: 8px;
          border-radius: var(--radius-sm);
          line-height: 1.5;
        }
        .lead-card-date {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .lead-card-footer {
          display: flex;
          gap: 8px;
        }
        .lead-card-footer .btn {
          flex: 1;
          justify-content: center;
          font-size: 13px;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default LeadCard;
