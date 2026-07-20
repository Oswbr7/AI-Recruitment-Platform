import { AuthApi } from "@/features/auth/api/AuthApi";

import { SessionService } from "../SessionService";

import type { LoginRequest } from "@/features/auth/types";

export class AuthApplicationService {

    static async login(
        request: LoginRequest
    ) {

        const response =
            await AuthApi.login(request);

        SessionService.login(
            response.accessToken,
            response.user
        );

        return response;

    }

    static logout() {

        SessionService.logout();

    }

}