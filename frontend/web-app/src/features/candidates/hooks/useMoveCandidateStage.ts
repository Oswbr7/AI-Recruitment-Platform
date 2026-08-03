import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";

interface MoveCandidateStageVariables {

    id: string;

    stage: string;

}

export function useMoveCandidateStage() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ id, stage }: MoveCandidateStageVariables) =>
            candidateApi.moveStage(id, stage),

        onSuccess: () => {

            toast.success("Candidate moved successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.all,
            });

        },

        onError: () => {

            toast.error("Unable to move candidate.");

        }

    });

}
