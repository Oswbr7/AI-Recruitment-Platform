import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";
import { toCreateCandidateRequest } from "../api/mappers/candidateFormMapper";
import type { CandidateFormValues } from "../schemas/candidateSchema";

export function useCreateCandidate() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: CandidateFormValues) =>
            candidateApi.create(toCreateCandidateRequest(values)),

        onSuccess: () => {

            toast.success("Candidate created successfully.");

            queryClient.invalidateQueries({

                queryKey: queryKeys.candidates.all,

            });

        },

        onError: () => {

            toast.error("Unable to create candidate.");

        }

    });

}
