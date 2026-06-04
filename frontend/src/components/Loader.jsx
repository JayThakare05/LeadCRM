/**
 * Loader — centered spinning circle for API loading states.
 * Accepts optional `inline` prop to render without the full container padding.
 */
const Loader = ({ inline = false }) => {
  if (inline) {
    return <span className="spinner spinner-sm" aria-label="Loading" />;
  }

  return (
    <div className="loader-container" role="status" aria-label="Loading">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
