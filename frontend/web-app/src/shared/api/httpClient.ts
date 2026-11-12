import axios from "axios";
import type { AxiosInstance } from "axios";

import { useAuthStore } from "@/features/auth/store/authStore";

/**
 * Factory única de clientes HTTP de la plataforma.
 *
 * Toda la lógica transversal vive AQUI y se aplica a cualquier cliente que
 * se cree con esta factory — antes estaba duplicada (copia por copia) en
 * los 5 clientes de `shared/api/`:
 *
 *   - Request: adjunta el JWT Bearer del authStore a cada petición.
 *   - Response: ante un 401 cierra la sesión local para que ProtectedRoute
 *     redirija al login (limpia tokens inválidos/expirados). Cualquier otro
 *   - error se propaga sin tocar para que React Query / la UI lo manejen.
 *
 * Un cliente por microservicio sigue existiendo (una URL base distinta por
 * servicio, igual que antes), pero son instancias de esta factory.
 */
export function createApiClient(baseURL: string): AxiosInstance {
    const client = axios.create({ baseURL });

    client.interceptors.request.use((config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }

            return Promise.reject(error);
        },
    );

    return client;
}
