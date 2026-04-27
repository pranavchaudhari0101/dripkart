import axios from 'axios'

declare global {
  interface Window {
    Clerk?: any;
  }
}

// Create Axios Instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      // @ts-ignore - Clerk attaches itself to window
      if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error('Failed to get Clerk token', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle 401s
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
