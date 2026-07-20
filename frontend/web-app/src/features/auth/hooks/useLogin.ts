import { useMutation } from "@tanstack/react-query";

import { AuthApplicationService } from "@/shared/services/auth/AuthApplicationService";

export function useLogin() {
    return useMutation({
        mutationFn: AuthApplicationService.login,
    });
}
