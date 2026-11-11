import { useMutation } from "@tanstack/react-query";

import { AuthApi } from "../api/AuthApi";

import type { RegisterRequest } from "../types";

export function useRegister() {
    return useMutation({
        mutationFn: (request: RegisterRequest) => AuthApi.register(request),
    });
}
