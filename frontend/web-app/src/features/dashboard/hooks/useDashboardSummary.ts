import { useMemo } from "react";

import { JobStatus } from "@/features/jobs/models/Job";
import { CandidateStage } from "@/features/candidates/models/Candidate";
import { InterviewStatus } from "@/features/interviews/models/Interview";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

export function useDashboardSummary() {

    const { jobs, candidates, companies, interviews, isLoading } = useDashboardSourceData();

    const summary = useMemo(() => {

        // "Open" = still in the active pipeline (Draft or Published), as opposed to Closed/Archived.
        const openJobs = jobs.filter(
            job => job.status !== JobStatus.Closed && job.status !== JobStatus.Archived
        ).length;

        const publishedJobs = jobs.filter(job => job.status === JobStatus.Published).length;

        const closedJobs = jobs.filter(job => job.status === JobStatus.Closed).length;

        const archivedJobs = jobs.filter(job => job.status === JobStatus.Archived).length;

        const now = new Date();

        const upcomingInterviews = interviews.filter(
            interview => interview.status === InterviewStatus.Scheduled && interview.scheduledAt >= now
        ).length;

        const completedInterviews = interviews.filter(
            interview => interview.status === InterviewStatus.Completed
        ).length;

        const offers = candidates.filter(candidate => candidate.stage === CandidateStage.Offer).length;

        const hired = candidates.filter(candidate => candidate.stage === CandidateStage.Hired);

        // No dedicated "HiredAt" field exists — approximate hiring time as days between
        // candidate creation and the last update on candidates who reached the Hired stage.
        const averageHiringTime = hired.length
            ? Math.round(
                hired.reduce((sum, c) => sum + (c.updatedAt.getTime() - c.createdAt.getTime()), 0) /
                hired.length /
                (1000 * 60 * 60 * 24)
            )
            : 0;

        return {

            openJobs,

            publishedJobs,

            closedJobs,

            archivedJobs,

            candidates: candidates.length,

            companies: companies.length,

            upcomingInterviews,

            completedInterviews,

            averageHiringTime,

            offers,

            hires: hired.length,

        };

    }, [jobs, candidates, companies, interviews]);

    return { ...summary, isLoading };

}
