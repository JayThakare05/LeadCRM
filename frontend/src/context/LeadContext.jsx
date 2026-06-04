import { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../api/leadApi.js';

// ─── Context Creation ─────────────────────────────────────────────────────────
const LeadContext = createContext(null);

// ─── Provider Component ───────────────────────────────────────────────────────
export const LeadProvider = ({ children }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    order: 'desc',
  });

  // ── fetchLeads — calls the API with current state params ───────────────────
  const fetchLeads = useCallback(
    async ({
      search = searchQuery,
      status = statusFilter,
      sortBy = sortConfig.sortBy,
      order = sortConfig.order,
      page = pagination.currentPage,
      limit = 10,
    } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllLeads({ search, status, sortBy, order, page, limit });
        setLeads(data.leads);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalLeads: data.totalLeads,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, statusFilter, sortConfig, pagination.currentPage]
  );

  // ── addLead — creates a new lead and refreshes list ────────────────────────
  const addLead = async (data) => {
    const result = await createLead(data);
    await fetchLeads({ page: 1 });
    return result;
  };

  // ── editLead — updates lead and refreshes current page ────────────────────
  const editLead = async (id, data) => {
    const result = await updateLead(id, data);
    await fetchLeads();
    return result;
  };

  // ── removeLead — deletes lead and refreshes list ──────────────────────────
  const removeLead = async (id) => {
    const result = await deleteLead(id);
    // If deleting last item on a page > 1, go back one page
    const newPage = leads.length === 1 && pagination.currentPage > 1
      ? pagination.currentPage - 1
      : pagination.currentPage;
    await fetchLeads({ page: newPage });
    return result;
  };

  // ── setSearch — updates search query and fetches from page 1 ──────────────
  const setSearch = (query) => {
    setSearchQuery(query);
    fetchLeads({ search: query, page: 1 });
  };

  // ── setFilter — updates status filter and fetches from page 1 ─────────────
  const setFilter = (status) => {
    setStatusFilter(status);
    fetchLeads({ status, page: 1 });
  };

  // ── setSort — updates sort config and fetches from page 1 ─────────────────
  const setSort = (sortBy, order) => {
    setSortConfig({ sortBy, order });
    fetchLeads({ sortBy, order, page: 1 });
  };

  // ── setPage — navigates to a specific page ────────────────────────────────
  const setPage = (pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
    fetchLeads({ page: pageNumber });
  };

  // ─── Context Value ──────────────────────────────────────────────────────────
  const value = {
    leads,
    loading,
    error,
    pagination,
    searchQuery,
    statusFilter,
    sortConfig,
    fetchLeads,
    addLead,
    editLead,
    removeLead,
    setSearch,
    setFilter,
    setSort,
    setPage,
  };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

export default LeadContext;
