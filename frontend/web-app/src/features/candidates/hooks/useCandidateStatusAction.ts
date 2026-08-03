import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import type { Candidate } from "../models/Candidate";

export function useCandidateStatusAction(
    action: (id: string) => Promise<Candidate>,
    successMessage: string,
    errorMessage: string,
) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => action(id),

        onSuccess: () => {

            toast.success(successMessage);

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.all,
            });

        },

        onError: () => {

            toast.error(errorMessage);

        }

    });

}
