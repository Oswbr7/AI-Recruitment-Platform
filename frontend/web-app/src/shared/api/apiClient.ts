import { createApiClient } from "./httpClient";

// auth-service (login/register, usuarios)
export const api = createApiClient(import.meta.env.VITE_API_URL);
