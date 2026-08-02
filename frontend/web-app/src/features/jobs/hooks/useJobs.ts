import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";

export function useJobs() {

    return useQuery({

        queryKey: queryKeys.jobs.all,

        queryFn: jobApi.getJobs

    });

}
