import axios from 'axios'

interface ClerkSession {
  getToken: () => Promise<string | null>;
}

interface ClerkInstance {
  session?: ClerkSession | null;
}

declare global {
  interface Window {
    Clerk?: ClerkInstance;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  console.warn('VITE_API_URL is not set. API calls may fail.');
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

api.interceptors.request.use(
  async (config) => {
    try {
      const clerk = window.Clerk;
      if (clerk?.session) {
        const token = await clerk.session.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error('Failed to get Clerk token', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized.');
    }
    return Promise.reject(error);
  }
)

export default api
