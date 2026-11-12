import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { usersApi } from "../services/UsersApi";

export function useChangeUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: string }) => usersApi.changeRole(id, role),

        // Invalida la lista para reflejar el nuevo rol sin refetch manual.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
    });
}
