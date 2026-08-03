import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateNoteApi } from "../services/CandidateNoteApi";

interface UpdateCandidateNoteVariables {

    noteId: string;

    content: string;

}

export function useUpdateCandidateNote(candidateId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ noteId, content }: UpdateCandidateNoteVariables) =>
            candidateNoteApi.update(candidateId, noteId, content),

        onSuccess: () => {

            toast.success("Note updated.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.candidates.notes(candidateId),
            });

        },

        onError: () => {

            toast.error("Unable to update note.");

        }

    });

}
