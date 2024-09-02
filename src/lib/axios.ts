import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.HOST || 'http://localhost:3000';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;