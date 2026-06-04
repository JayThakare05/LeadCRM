import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Base URL comes from Vite environment variable — never hardcoded
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Get all leads with optional query params for search, filter, sort, paginate.
 * @param {Object} params - { search, status, sortBy, order, page, limit }
 */
export const getAllLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Create a new lead.
 * @param {Object} data - { name, email, phone, company, status, notes }
 */
export const createLead = async (data) => {
  const response = await api.post('/api/leads', data);
  return response.data;
};

/**
 * Get a single lead by ID.
 * @param {string} id - MongoDB ObjectId
 */
export const getLeadById = async (id) => {
  const response = await api.get(`/api/leads/${id}`);
  return response.data;
};

/**
 * Update an existing lead.
 * @param {string} id   - MongoDB ObjectId
 * @param {Object} data - Fields to update
 */
export const updateLead = async (id, data) => {
  const response = await api.put(`/api/leads/${id}`, data);
  return response.data;
};

/**
 * Delete a lead by ID.
 * @param {string} id - MongoDB ObjectId
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

export default api;
