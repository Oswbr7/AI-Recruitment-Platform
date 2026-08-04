import { useMemo } from "react";

import { useInterviews } from "@/features/interviews/hooks/useInterviews";
import { InterviewStatus } from "@/features/interviews/models/Interview";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";

export function useInterviewDashboardStats() {

    const { data: interviewsData, isLoading: interviewsLoading } = useInterviews({ pageSize: 200 });

    const { data: candidatesData, isLoading: candidatesLoading } = useCandidates({ pageSize: 200 });

    const stats = useMemo(() => {

        const interviews = interviewsData?.items ?? [];

        const candidateNameById = new Map<string, string>();

        for (const candidate of candidatesData?.items ?? [])
            candidateNameById.set(candidate.id, `${candidate.firstName} ${candidate.lastName}`);

        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        const interviewsTodayCount = interviews.filter(
            i => i.scheduledAt >= todayStart && i.scheduledAt < todayEnd
        ).length;

        const upcoming = interviews
            .filter(i => i.status === InterviewStatus.Scheduled && i.scheduledAt >= now)
            .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

        const completedCount = interviews.filter(i => i.status === InterviewStatus.Completed).length;

        const cancelledCount = interviews.filter(i => i.status === InterviewStatus.Cancelled).length;

        const scored = interviews.filter(i => i.overallScore != null);

        const averageScore = scored.length
            ? scored.reduce((sum, i) => sum + (i.overallScore ?? 0), 0) / scored.length
            : 0;

        const byStageMap = new Map<string, number>();

        for (const interview of interviews)
            byStageMap.set(interview.interviewStage, (byStageMap.get(interview.interviewStage) ?? 0) + 1);

        return {

            interviewsTodayCount,

            upcomingCount: upcoming.length,

            completedCount,

            cancelledCount,

            averageScore: Math.round(averageScore * 10) / 10,

            byStage: Array.from(byStageMap.entries()).map(([stage, value]) => ({ stage, value })),

            upcomingInterviews: upcoming.slice(0, 5).map(interview => ({
                id: interview.id,
                candidateName: candidateNameById.get(interview.candidateId) ?? "Unknown candidate",
                scheduledAt: interview.scheduledAt,
            })),

        };

    }, [interviewsData, candidatesData]);

    return {

        ...stats,

        isLoading: interviewsLoading || candidatesLoading,

    };

}
