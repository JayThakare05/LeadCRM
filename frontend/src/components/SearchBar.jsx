import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar — controlled input with 300ms debounce.
 * Props:
 *   value    — current search query from context
 *   onChange — callback with debounced value
 */
const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const debounceRef = useRef(null);

  // Keep local in sync if external value resets
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);

    // Debounce the external callback by 300ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newVal);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    clearTimeout(debounceRef.current);
    onChange('');
  };

  return (
    <div className="search-bar">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, email or company..."
        value={localValue}
        onChange={handleChange}
        id="lead-search"
        aria-label="Search leads"
      />
      {localValue && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}

      <style>{`
        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 220px;
        }
        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--color-text-muted);
          pointer-events: none;
          flex-shrink: 0;
        }
        .search-input {
          width: 100%;
          padding: 8px 36px 8px 34px;
          font-family: var(--font-family);
          font-size: 14px;
          color: var(--color-text-primary);
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          outline: none;
          transition: var(--transition);
        }
        .search-input::placeholder {
          color: var(--color-text-muted);
        }
        .search-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }
        .search-clear {
          position: absolute;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: var(--color-bg-hover);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: var(--transition);
        }
        .search-clear:hover {
          background: var(--color-border);
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
