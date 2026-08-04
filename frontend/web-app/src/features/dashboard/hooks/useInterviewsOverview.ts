import { useMemo } from "react";
import { format, isSameWeek, startOfWeek, subWeeks } from "date-fns";

import { InterviewStatus } from "@/features/interviews/models/Interview";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

export function useInterviewsOverview() {

    const { interviews, isLoading } = useDashboardSourceData();

    const overview = useMemo(() => {

        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

        const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

        const today = interviews.filter(
            interview => interview.scheduledAt >= todayStart && interview.scheduledAt < todayEnd
        ).length;

        const tomorrow = interviews.filter(
            interview => interview.scheduledAt >= todayEnd && interview.scheduledAt < tomorrowEnd
        ).length;

        const thisWeek = interviews.filter(
            interview => interview.scheduledAt >= todayStart && interview.scheduledAt < weekEnd
        ).length;

        const completed = interviews.filter(interview => interview.status === InterviewStatus.Completed).length;

        const cancelled = interviews.filter(interview => interview.status === InterviewStatus.Cancelled).length;

        const scored = interviews.filter(interview => interview.overallScore != null);

        const averageScore = scored.length
            ? Math.round((scored.reduce((sum, i) => sum + (i.overallScore ?? 0), 0) / scored.length) * 10) / 10
            : 0;

        const upcoming = interviews.filter(
            interview => interview.status === InterviewStatus.Scheduled && interview.scheduledAt >= now
        ).length;

        const weekStarts = Array.from({ length: 8 }, (_, i) => startOfWeek(subWeeks(now, 7 - i)));

        const perWeek = weekStarts.map(weekStart => ({
            week: format(weekStart, "MMM d"),
            value: interviews.filter(interview => isSameWeek(interview.scheduledAt, weekStart)).length,
        }));

        return {

            today,

            tomorrow,

            thisWeek,

            completed,

            cancelled,

            averageScore,

            upcoming,

            perWeek,

        };

    }, [interviews]);

    return { ...overview, isLoading };

}
