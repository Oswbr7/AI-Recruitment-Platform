import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { candidateApi } from "../services/CandidateApi";

export function useCandidateDetail(id: string) {

    return useQuery({

        queryKey: queryKeys.candidates.detail(id),

        queryFn: () => candidateApi.getById(id),

        enabled: Boolean(id),

    });

}
