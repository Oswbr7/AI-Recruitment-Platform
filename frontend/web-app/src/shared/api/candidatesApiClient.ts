import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export const candidatesApi = axios.create({
  baseURL: import.meta.env.VITE_CANDIDATES_API_URL
});

candidatesApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
