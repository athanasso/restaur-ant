import axios from 'axios';

const API_URL = process.env.HOST || 'http://localhost:3000';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;