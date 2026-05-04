import axios from 'axios'

declare global {
  interface Window {
    Clerk?: any;
  }
}

// Create Axios Instance with proper timeout
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend.pranav1727chaudhari.workers.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 second timeout — fail fast, fallback to mock data
})

// Request Interceptor: Attach Clerk JWT token
api.interceptors.request.use(
  async (config) => {
    try {
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
