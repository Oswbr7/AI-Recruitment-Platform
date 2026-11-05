import { createApiClient } from "./httpClient";

// job-service
export const jobsApi = createApiClient(import.meta.env.VITE_JOBS_API_URL);
