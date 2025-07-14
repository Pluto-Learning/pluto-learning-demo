// utils/axiosInstance.js
import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { getCookies } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const cert = fs.readFileSync(path.join(process.cwd(), 'certs', 'client-cert.pem'));
const key = fs.readFileSync(path.join(process.cwd(), 'certs', 'client-key.pem'));
const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: false, // for testing only, not recommended for prod
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  httpsAgent,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Bearer token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookies('token'); // Get token from cookie
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
