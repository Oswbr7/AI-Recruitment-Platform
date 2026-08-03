import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";

export function useDeleteCandidate() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => candidateApi.remove(id),

        onSuccess: () => {

            toast.success("Candidate deleted successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.all,
            });

        },

        onError: () => {

            toast.error("Unable to delete candidate.");

        }

    });

}
