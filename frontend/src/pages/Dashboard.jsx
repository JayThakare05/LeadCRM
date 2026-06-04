import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Users, TrendingUp, Award, XCircle, Plus,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import StatsCard from '../components/StatsCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterDropdown from '../components/FilterDropdown.jsx';
import LeadTable from '../components/LeadTable.jsx';
import LeadCard from '../components/LeadCard.jsx';
import Pagination from '../components/Pagination.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loader from '../components/Loader.jsx';

const Dashboard = () => {
  const {
    leads,
    loading,
    error,
    pagination,
    searchQuery,
    statusFilter,
    sortConfig,
    fetchLeads,
    removeLead,
    setSearch,
    setFilter,
    setSort,
    setPage,
  } = useLeads();

  // ── Local state for delete modal ───────────────────────────────────────────
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch leads on mount ───────────────────────────────────────────────────
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Compute stats from all leads (we do a separate call for all) ──────────
  // Stats are derived from the current filtered set as a snapshot
  const stats = {
    total:     pagination.totalLeads,
    converted: leads.filter((l) => l.status === 'Converted').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    lost:      leads.filter((l) => l.status === 'Lost').length,
  };

  // ── Delete handlers ────────────────────────────────────────────────────────
  const handleDeleteClick = (lead) => setLeadToDelete(lead);
  const handleDeleteCancel = () => setLeadToDelete(null);

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    setDeleting(true);
    try {
      await removeLead(leadToDelete._id);
      toast.success(`"${leadToDelete.name}" has been deleted`);
    } catch {
      toast.error('Failed to delete lead. Please try again.');
    } finally {
      setDeleting(false);
      setLeadToDelete(null);
    }
  };

  return (
    <div className="page-container">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage and track your sales leads</p>
        </div>
        <Link to="/add" className="btn btn-primary" id="dashboard-add-lead-btn">
          <Plus size={16} /> Add Lead
        </Link>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatsCard
          title="Total Leads"
          count={pagination.totalLeads}
          color="var(--stats-total)"
          Icon={Users}
        />
        <StatsCard
          title="Converted"
          count={stats.converted}
          color="var(--stats-converted)"
          Icon={TrendingUp}
        />
        <StatsCard
          title="Qualified"
          count={stats.qualified}
          color="var(--stats-qualified)"
          Icon={Award}
        />
        <StatsCard
          title="Lost"
          count={stats.lost}
          color="var(--stats-lost)"
          Icon={XCircle}
        />
      </div>

      {/* ── Search + Filter + Sort Controls ─────────────────────────────────── */}
      <div className="controls-bar card">
        <SearchBar value={searchQuery} onChange={setSearch} />
        <FilterDropdown value={statusFilter} onChange={setFilter} />
        <div className="select-wrapper sort-select-wrapper">
          <select
            className="form-select"
            value={`${sortConfig.sortBy}:${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':');
              setSort(field, order);
            }}
            id="sort-select"
            aria-label="Sort leads"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="name:asc">Name (A→Z)</option>
            <option value="name:desc">Name (Z→A)</option>
            <option value="company:asc">Company (A→Z)</option>
          </select>
        </div>
      </div>

      {/* ── Error State ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* ── Leads Table / Cards ──────────────────────────────────────────────── */}
      <div className="leads-container card">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hide-mobile">
              <LeadTable
                leads={leads}
                sortConfig={sortConfig}
                onSort={setSort}
                onDelete={handleDeleteClick}
              />
            </div>

            {/* Mobile Cards */}
            <div className="hide-desktop mobile-cards-list">
              {leads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Users size={32} />
                  </div>
                  <p className="empty-state-title">No leads found</p>
                  <p className="empty-state-desc">
                    Try adjusting your search or filter, or add a new lead.
                  </p>
                </div>
              ) : (
                leads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              limit={10}
            />
          </>
        )}
      </div>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {leadToDelete && !deleting && (
        <ConfirmModal
          leadName={leadToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <style>{`
        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .controls-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .sort-select-wrapper {
          min-width: 160px;
        }
        .leads-container {
          overflow: hidden;
        }
        .mobile-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
        }
        .error-banner {
          padding: 12px 16px;
          background: var(--color-danger-light);
          color: var(--color-danger);
          border: 1px solid #fecaca;
          border-radius: var(--radius-lg);
          margin-bottom: 16px;
          font-size: 14px;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .sort-select-wrapper {
            min-width: unset;
          }
          .dashboard-header {
            flex-direction: column;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
