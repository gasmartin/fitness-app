import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reset } from './NavigationService';

const api = axios.create({
  baseURL: 'http://192.168.25.42:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.map((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/users/login')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const response = await axios.post('http://192.168.25.42:8000/users/refresh-token', { refreshToken });

          const newAccessToken = response.data.accessToken;
          await AsyncStorage.setItem('accessToken', newAccessToken);

          isRefreshing = false;
          onRefreshed(newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;

          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');

          reset(); // Redireciona para a tela de login

          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
