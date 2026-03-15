import axios from 'axios'

// Create Axios Instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8787/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    // We try to grab the token directly from localStorage since the Zustand store is persisted
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        const token = parsed.state?.token
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (err) {
         console.error('Failed to parse auth storage', err)
      }
    }

    return config
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
      console.warn('Session expired or unauthorized. Clearing session.')
      localStorage.removeItem('auth-storage')
    }
    return Promise.reject(error)
  }
)

export default api
