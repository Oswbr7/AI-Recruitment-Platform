import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export const companiesApi = axios.create({
  baseURL: import.meta.env.VITE_COMPANIES_API_URL
});

companiesApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
