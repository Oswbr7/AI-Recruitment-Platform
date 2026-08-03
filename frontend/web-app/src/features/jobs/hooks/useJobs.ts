import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";
import type { GetJobsParams } from "../types/GetJobsParams";

export function useJobs(params?: GetJobsParams) {

    return useQuery({

        queryKey: queryKeys.jobs.list(params),

        queryFn: () => jobApi.getJobs(params)

    });

}
