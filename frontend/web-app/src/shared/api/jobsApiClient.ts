import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export const jobsApi = axios.create({
  baseURL: import.meta.env.VITE_JOBS_API_URL
});

jobsApi.interceptors.request.use((config) => {
  const token =
    useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});
