import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";
import type { GetJobsParams } from "../types/GetJobsParams";

export function useJobs(params?: GetJobsParams) {

    // GET /api/jobs es paginado (PagedResponse desde 2026-11-06). Los
    // consumidores actuales (tablas client-side, selectores, dashboard)
    // esperan el array completo: pageSize 100 por defecto y unwrap de
    // .items aqui, sin tocarlos. Cuando JobsView migre a paginacion
    // server-side, su hook llamara directo a jobApi.getJobs.
    const merged = { page: 1, pageSize: 100, ...params };

    return useQuery({

        queryKey: queryKeys.jobs.list(merged),

        queryFn: () => jobApi.getJobs(merged).then((r) => r.items)

    });

}
