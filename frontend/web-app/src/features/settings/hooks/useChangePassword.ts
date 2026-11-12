import { useMutation } from "@tanstack/react-query";

import { AuthApi } from "@/features/auth/api/AuthApi";

export function useChangePassword() {
    return useMutation({
        mutationFn: (request: { currentPassword: string; newPassword: string }) =>
            AuthApi.changePassword(request),
    });
}
