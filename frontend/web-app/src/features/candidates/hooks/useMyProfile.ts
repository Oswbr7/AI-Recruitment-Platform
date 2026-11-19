import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { myProfileApi } from "../services/CandidateApi";
import type { Candidate } from "../models/Candidate";

/**
 * Mi perfil de candidato (404 del backend -> null, no error): null significa
 * "el usuario autenticado todavía no creó su perfil".
 */
export function useMyProfile() {
    return useQuery({
        queryKey: queryKeys.candidates.me,
        queryFn: async (): Promise<Candidate | null> => {
            try {
                return await myProfileApi.getMine();
            } catch (error: any) {
                if (error?.response?.status === 404) return null;
                throw error;
            }
        },
    });
}

export function useCreateMyProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: myProfileApi.createMine,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.candidates.me }),
    });
}
