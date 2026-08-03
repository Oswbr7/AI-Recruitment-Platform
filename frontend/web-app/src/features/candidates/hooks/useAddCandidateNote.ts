import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateNoteApi } from "../services/CandidateNoteApi";

export function useAddCandidateNote(candidateId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (content: string) =>
            candidateNoteApi.add(candidateId, content),

        onSuccess: () => {

            toast.success("Note added.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.notes(candidateId),
            });

        },

        onError: () => {

            toast.error("Unable to add note.");

        }

    });

}
