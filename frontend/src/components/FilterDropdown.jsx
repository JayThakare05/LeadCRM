/**
 * FilterDropdown — status filter selector.
 * Visually highlights the active filter with an accent color.
 * Props:
 *   value    — current status filter value
 *   onChange — callback with selected status
 */
const FILTER_OPTIONS = [
  { value: '',          label: 'All Statuses' },
  { value: 'New',       label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Lost',      label: 'Lost' },
];

const FilterDropdown = ({ value, onChange }) => {
  const isActive = value !== '';

  return (
    <div className="filter-dropdown">
      <div className="select-wrapper">
        <select
          className={`form-select filter-select ${isActive ? 'active' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id="status-filter"
          aria-label="Filter by status"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <style>{`
        .filter-select {
          min-width: 150px;
          font-size: 14px;
        }
        .filter-select.active {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-light);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default FilterDropdown;
