import { createApiClient } from "./httpClient";

// candidate-service
export const candidatesApi = createApiClient(import.meta.env.VITE_CANDIDATES_API_URL);
