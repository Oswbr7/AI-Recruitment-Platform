import { createApiClient } from "./httpClient";

// company-service
export const companiesApi = createApiClient(import.meta.env.VITE_COMPANIES_API_URL);
