import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ChevronUp, ChevronDown, Users } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * LeadTable — desktop table view (visible > 768px).
 * Shows sortable columns, edit/delete actions per row.
 * Props:
 *   leads      — array of lead objects
 *   sortConfig — { sortBy, order }
 *   onSort     — callback(field, order)
 *   onDelete   — callback(lead) — opens confirm modal
 */
const LeadTable = ({ leads, sortConfig, onSort, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSort = (field) => {
    const newOrder =
      sortConfig.sortBy === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.sortBy !== field) {
      return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    }
    return sortConfig.order === 'asc'
      ? <ChevronUp size={14} style={{ color: 'var(--color-accent)' }} />
      : <ChevronDown size={14} style={{ color: 'var(--color-accent)' }} />;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (leads.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Users size={32} />
        </div>
        <p className="empty-state-title">No leads found</p>
        <p className="empty-state-desc">
          Try adjusting your search or filter, or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th
              className="sortable"
              onClick={() => handleSort('name')}
              title="Sort by name"
            >
              <span className="th-content">
                Name <SortIcon field="name" />
              </span>
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th
              className="sortable"
              onClick={() => handleSort('company')}
              title="Sort by company"
            >
              <span className="th-content">
                Company <SortIcon field="company" />
              </span>
            </th>
            <th>Status</th>
            <th
              className="sortable"
              onClick={() => handleSort('createdAt')}
              title="Sort by date"
            >
              <span className="th-content">
                Created <SortIcon field="createdAt" />
              </span>
            </th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
            {leads.map((lead) => {
              const leadCreatorId = lead.createdBy?._id || lead.createdBy;
              const currentUserId = user?.id || user?._id;
              const canModify = currentUserId && leadCreatorId && leadCreatorId.toString() === currentUserId.toString();

              return (
                <tr key={lead._id}>
                  <td>
                    {canModify ? (
                      <button
                        className="lead-name-btn"
                        onClick={() => navigate(`/edit/${lead._id}`)}
                        title="Edit lead"
                      >
                        {lead.name}
                      </button>
                    ) : (
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{lead.name}</span>
                    )}
                  </td>
                  <td className="text-muted">{lead.email}</td>
                  <td className="text-muted">{lead.phone}</td>
                  <td>{lead.company}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td className="text-muted">{formatDate(lead.createdAt)}</td>
                  <td>
                    <div className="action-btns">
                      {canModify ? (
                        <>
                          <button
                            className="btn-icon edit"
                            onClick={() => navigate(`/edit/${lead._id}`)}
                            title="Edit lead"
                            aria-label={`Edit ${lead.name}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => onDelete(lead)}
                            title="Delete lead"
                            aria-label={`Delete ${lead.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          View Only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <style>{`
        .th-content {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .lead-name-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-accent);
          padding: 0;
          text-align: left;
          transition: var(--transition);
        }
        .lead-name-btn:hover {
          color: var(--color-accent-hover);
          text-decoration: underline;
        }
        .action-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default LeadTable;
