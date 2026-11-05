import { createApiClient } from "./httpClient";

// interview-service
export const interviewsApi = createApiClient(import.meta.env.VITE_INTERVIEWS_API_URL);
