import { useMemo } from "react";

import { useJobDetail } from "@/features/jobs/hooks/useJobDetail";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";

import { rankCandidates } from "../scoring";
import type { CandidateMatch } from "../scoring";

/**
 * Agregación cross-feature en el cliente (mismo patrón que el Dashboard):
 * reutiliza los hooks/APIs existentes de jobs y candidates con las query
 * keys centralizadas, asi que el cache se comparte con esas paginas.
 */
export function useJobMatches(selectedJobId?: string) {
    const jobsQuery = useJobs();
    const jobId = selectedJobId ?? jobsQuery.data?.[0]?.id;

    const jobQuery = useJobDetail(jobId ?? "");
    const candidatesQuery = useCandidates({ page: 1, pageSize: 100 });

    const matches: CandidateMatch[] = useMemo(() => {
        if (!jobQuery.data || !candidatesQuery.data) return [];
        return rankCandidates(jobQuery.data, candidatesQuery.data.items);
    }, [jobQuery.data, candidatesQuery.data]);

    return {
        jobsQuery,
        jobQuery,
        candidatesQuery,
        jobId,
        matches,
    };
}
