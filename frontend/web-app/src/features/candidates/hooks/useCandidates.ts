import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";
import type { GetCandidatesParams } from "../types/GetCandidatesParams";

export function useCandidates(params: GetCandidatesParams) {

    return useQuery({

        queryKey: queryKeys.candidates.list(params),

        queryFn: () => candidateApi.getPaged(params),

        placeholderData: keepPreviousData,

    });

}
