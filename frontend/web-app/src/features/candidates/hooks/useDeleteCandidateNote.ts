import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateNoteApi } from "../services/CandidateNoteApi";

export function useDeleteCandidateNote(candidateId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (noteId: string) =>
            candidateNoteApi.remove(candidateId, noteId),

        onSuccess: () => {

            toast.success("Note deleted.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.notes(candidateId),
            });

        },

        onError: () => {

            toast.error("Unable to delete note.");

        }

    });

}
