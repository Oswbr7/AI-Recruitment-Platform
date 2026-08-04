import { useMemo } from "react";
import { format, isSameMonth, startOfMonth, subMonths } from "date-fns";

import { CandidateStage, CandidateStatus } from "@/features/candidates/models/Candidate";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

const EXPERIENCE_BUCKETS = [
    { label: "0-2 yrs", min: 0, max: 2 },
    { label: "3-5 yrs", min: 3, max: 5 },
    { label: "6-10 yrs", min: 6, max: 10 },
    { label: "10+ yrs", min: 11, max: Infinity },
];

export function useCandidatesOverview() {

    const { candidates, isLoading } = useDashboardSourceData();

    const overview = useMemo(() => {

        const byStageMap = new Map<string, number>();

        for (const candidate of candidates)
            byStageMap.set(candidate.stage, (byStageMap.get(candidate.stage) ?? 0) + 1);

        const byStage = Array.from(byStageMap.entries()).map(([stage, value]) => ({ stage, value }));

        const activeCount = candidates.filter(c => c.status === CandidateStatus.Active).length;

        const archivedCount = candidates.filter(c => c.status === CandidateStatus.Archived).length;

        const byExperience = EXPERIENCE_BUCKETS.map(bucket => ({
            label: bucket.label,
            value: candidates.filter(
                c => (c.yearsOfExperience ?? -1) >= bucket.min && (c.yearsOfExperience ?? -1) <= bucket.max
            ).length,
        }));

        const recentCandidates = [...candidates]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);

        const now = new Date();

        const monthStarts = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(now, 5 - i)));

        // No dedicated "HiredAt" field exists — same approximation as Time To Hire,
        // using updatedAt as the point a candidate reached the Hired stage.
        const hiringTrend = monthStarts.map(monthStart => ({
            month: format(monthStart, "MMM"),
            value: candidates.filter(
                c => c.stage === CandidateStage.Hired && isSameMonth(c.updatedAt, monthStart)
            ).length,
        }));

        return {

            byStage,

            activeCount,

            archivedCount,

            byExperience,

            recentCandidates,

            hiringTrend,

        };

    }, [candidates]);

    return { ...overview, isLoading };

}
