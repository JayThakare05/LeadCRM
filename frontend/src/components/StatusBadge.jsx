/**
 * StatusBadge — renders a colored pill badge for a lead's status.
 * Uses CSS custom properties from global.css for consistent theming.
 */
const statusConfig = {
  New:       { bg: 'var(--status-new-bg)',       color: 'var(--status-new-text)' },
  Contacted: { bg: 'var(--status-contacted-bg)', color: 'var(--status-contacted-text)' },
  Qualified: { bg: 'var(--status-qualified-bg)', color: 'var(--status-qualified-text)' },
  Converted: { bg: 'var(--status-converted-bg)', color: 'var(--status-converted-text)' },
  Lost:      { bg: 'var(--status-lost-bg)',       color: 'var(--status-lost-text)' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    bg: 'var(--color-bg-secondary)',
    color: 'var(--color-text-secondary)',
  };

  return (
    <span
      className="badge"
      style={{ background: config.bg, color: config.color }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
