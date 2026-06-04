/**
 * StatsCard — displays a key metric with an icon and colored left border accent.
 * Props: title, count, color (CSS color value), Icon (lucide-react component)
 */
const StatsCard = ({ title, count, color, Icon }) => {
  return (
    <div
      className="stats-card card"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: `${color}1a`, color }}>
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
        <span className="stats-card-count" style={{ color }}>
          {count}
        </span>
      </div>
      <p className="stats-card-title">{title}</p>

      <style>{`
        .stats-card {
          padding: 20px 24px;
          transition: var(--transition);
          cursor: default;
        }
        .stats-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .stats-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .stats-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stats-card-count {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .stats-card-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
};

export default StatsCard;
