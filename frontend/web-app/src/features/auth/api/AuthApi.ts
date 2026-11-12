import { api } from "@/shared/api/apiClient";

import type { LoginRequest, LoginResponse, RegisterRequest } from "../types";

export class AuthApi {
    static async login(request: LoginRequest) {
        const response = await api.post<LoginResponse>("/auth/login", request);

        return response.data;
    }

    // El backend envuelve el Guid del usuario nuevo en el envelope estandar
    // { success, message, data } — al registrarse aun no hay sesion, asi que
    // el frontend solo confirma y manda a login.
    static async register(request: RegisterRequest): Promise<void> {
        await api.post("/auth/register", request);
    }
}
