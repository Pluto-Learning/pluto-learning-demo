// api/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Fetch base URL from environment variable

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can add interceptors here for request/response handling
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; // Export the instance
