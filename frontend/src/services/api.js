import axios from 'axios';

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://gita-life-be.vercel.app'
  : 'http://localhost:5000/api';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;
const apiBaseUrl = import.meta.env.PROD
  ? configuredApiBaseUrl.replace(/\/api\/?$/, '')
  : configuredApiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
