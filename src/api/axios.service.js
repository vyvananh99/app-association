import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Replace with your base URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set up response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401 && window.location.pathname !== '/login') {
      sessionStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
