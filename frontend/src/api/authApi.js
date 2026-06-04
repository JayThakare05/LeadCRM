import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Register a new user
 * @param {string} username
 * @param {string} password
 */
export const registerUser = async (username, password) => {
  const response = await api.post('/api/auth/register', { username, password });
  return response.data;
};

/**
 * Login an existing user
 * @param {string} username
 * @param {string} password
 */
export const loginUser = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

export default api;
