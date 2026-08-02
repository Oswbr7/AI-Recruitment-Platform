import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";

export function useJobDetail(id: string) {

    return useQuery({

        queryKey: queryKeys.jobs.detail(id),

        queryFn: () => jobApi.getById(id),

        enabled: Boolean(id),

    });

}
