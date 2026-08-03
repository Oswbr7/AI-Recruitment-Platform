import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";
import { toUpdateCandidateRequest } from "../api/mappers/candidateFormMapper";
import type { CandidateFormValues } from "../schemas/candidateSchema";

export function useUpdateCandidate(id: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: CandidateFormValues) =>
            candidateApi.update(id, toUpdateCandidateRequest(values)),

        onSuccess: () => {

            toast.success("Candidate updated successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.all,
            });

        },

        onError: () => {

            toast.error("Unable to update candidate.");

        }

    });

}
