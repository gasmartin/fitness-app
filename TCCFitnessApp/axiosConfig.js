import axios from 'axios';

import { getToken } from './helpers/token';

const api = axios.create({
  baseURL: 'http://192.168.25.42:8000',
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;