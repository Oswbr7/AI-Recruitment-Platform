import { api } from "@/shared/api/apiClient";

import type {
    LoginRequest,
    LoginResponse
} from "../types";

export class AuthApi {

    static async login(
        request: LoginRequest
    ) {

        const response =
            await api.post<LoginResponse>(
                "/auth/login",
                request
            );

        return response.data;

    }

}