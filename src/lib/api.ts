import axios from "axios";
import { isTokenValid } from "./jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-cache",
  },
});

// Request interceptor to add authentication token
client.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const userStore = localStorage.getItem('userStore');
        if (userStore) {
          const userData = JSON.parse(userStore);
          const user = userData.state?.user;
          
          if (user && user.token && isTokenValid(user.token)) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
      } catch (error) {
        console.error('Error adding auth token to request:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token is invalid or expired, clear user data
      localStorage.removeItem('userStore');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client; 