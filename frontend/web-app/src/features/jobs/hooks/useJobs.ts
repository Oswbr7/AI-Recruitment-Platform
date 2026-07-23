import { useQuery } from "@tanstack/react-query";

import { JobApi } from "../api/JobApi";

export function useJobs() {

    return useQuery({

        queryKey: ["jobs"],

        queryFn: JobApi.getJobs

    });

}