/**
 * Axios API client
 *
 * All HTTP requests to the backend go through this single instance so that
 * the Authorization header and base URL are set consistently in one place.
 *
 * The response interceptor handles session expiry globally: if any request
 * returns a 401 Unauthorized (e.g. because the JWT has expired or been
 * tampered with), the stored token is cleared and the user is redirected
 * to the home/login page automatically. This prevents a degraded state
 * where authenticated pages are accessed with an invalid token.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lasustech_token');
      // Only redirect if not already on the public home page to avoid a redirect loop
      if (window.location.pathname !== '/') window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
