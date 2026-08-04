import { useMemo } from "react";

import { JobStatus } from "@/features/jobs/models/Job";
import { CandidateStage } from "@/features/candidates/models/Candidate";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

export function useDashboardMetrics() {

    const { jobs, candidates, companies, interviews, isLoading } = useDashboardSourceData();

    const metrics = useMemo(() => {

        const openJobs = jobs.filter(
            job => job.status !== JobStatus.Closed && job.status !== JobStatus.Archived
        ).length;

        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        const interviewsToday = interviews.filter(
            interview => interview.scheduledAt >= todayStart && interview.scheduledAt < todayEnd
        ).length;

        const hired = candidates.filter(c => c.stage === CandidateStage.Hired);

        const rejected = candidates.filter(c => c.stage === CandidateStage.Rejected);

        const decided = hired.length + rejected.length;

        const hiringSuccessRate = decided > 0 ? Math.round((hired.length / decided) * 100) : 0;

        // Same approximation used in useDashboardSummary: no dedicated "HiredAt" field exists.
        const timeToHire = hired.length
            ? Math.round(
                hired.reduce((sum, c) => sum + (c.updatedAt.getTime() - c.createdAt.getTime()), 0) /
                hired.length /
                (1000 * 60 * 60 * 24)
            )
            : 0;

        return {

            openJobs,

            totalCandidates: candidates.length,

            interviewsToday,

            companies: companies.length,

            hiringSuccessRate,

            timeToHire,

            offersAccepted: hired.length,

        };

    }, [jobs, candidates, companies, interviews]);

    return { ...metrics, isLoading };

}
