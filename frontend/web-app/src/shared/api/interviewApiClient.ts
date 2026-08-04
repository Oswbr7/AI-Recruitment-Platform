import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export const interviewsApi = axios.create({
  baseURL: import.meta.env.VITE_INTERVIEWS_API_URL
});

interviewsApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
