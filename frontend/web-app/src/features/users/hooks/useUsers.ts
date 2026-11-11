import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { usersApi } from "../services/UsersApi";

export function useUsers() {
    return useQuery({
        queryKey: queryKeys.users.all,
        queryFn: () => usersApi.getAll(),
    });
}
