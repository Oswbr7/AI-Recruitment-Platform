import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateNoteApi } from "../services/CandidateNoteApi";

export function useCandidateNotes(candidateId: string) {

    return useQuery({

        queryKey: queryKeys.candidates.notes(candidateId),

        queryFn: () => candidateNoteApi.getByCandidateId(candidateId),

        enabled: Boolean(candidateId),

    });

}
