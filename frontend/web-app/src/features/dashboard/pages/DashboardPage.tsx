import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Archive, BriefcaseBusiness, Building2, Calendar, CalendarCheck, CalendarX, Star, Users } from "lucide-react";

import { queryKeys } from "@/shared/query/queryKeys";

import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardSection } from "../components/DashboardSection";
import { HiringPipeline } from "../components/HiringPipeline";
import { StatsCard } from "../components/StatsCard";
import { UpcomingInterviews } from "../components/UpcomingInterviews";
import { RecentActivityFeed } from "../components/RecentActivityFeed";
import { DashboardQuickActions } from "../components/DashboardQuickActions";
import { JobsOverviewSection } from "../components/JobsOverviewSection";
import { CandidatesOverviewSection } from "../components/CandidatesOverviewSection";
import { CompaniesByIndustryChart } from "../components/CompaniesByIndustryChart";
import { CompaniesBySizeChart } from "../components/CompaniesBySizeChart";
import { TopCompaniesList } from "../components/TopCompaniesList";
import { InterviewFunnelChart } from "../components/InterviewFunnelChart";
import { DashboardBarChart } from "../components/charts/DashboardBarChart";
import { DashboardLineChart } from "../components/charts/DashboardLineChart";

import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { useHiringFunnel } from "../hooks/useHiringFunnel";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { useJobsOverview } from "../hooks/useJobsOverview";
import { useCandidatesOverview } from "../hooks/useCandidatesOverview";
import { useInterviewsOverview } from "../hooks/useInterviewsOverview";
import { useCompanyDashboardStats } from "../hooks/useCompanyDashboardStats";
import { useInterviewDashboardStats } from "../hooks/useInterviewDashboardStats";

export function DashboardPage() {

    const queryClient = useQueryClient();

    const [lastUpdated, setLastUpdated] = useState(() => new Date());

    const summary = useDashboardSummary();

    const metrics = useDashboardMetrics();

    const funnel = useHiringFunnel();

    const activity = useRecentActivity();

    const jobsOverview = useJobsOverview();

    const candidatesOverview = useCandidatesOverview();

    const interviewsOverview = useInterviewsOverview();

    const companyStats = useCompanyDashboardStats();

    const interviewStats = useInterviewDashboardStats();

    const handleRefresh = () => {

        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.candidates.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });

        setLastUpdated(new Date());

    };

    if (summary.isLoading)
        return <DashboardSkeleton />;

    return (

        <div className="space-y-8">

            <DashboardHeader
                lastUpdated={lastUpdated}
                onRefresh={handleRefresh}
            />

            <DashboardSection title="Overview">

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

                    <StatsCard
                        title="Open Jobs"
                        value={summary.openJobs}
                        icon={BriefcaseBusiness}
                    />

                    <StatsCard
                        title="Candidates"
                        value={summary.candidates}
                        icon={Users}
                    />

                    <StatsCard
                        title="Companies"
                        value={summary.companies}
                        icon={Building2}
                    />

                    <StatsCard
                        title="Upcoming Interviews"
                        value={summary.upcomingInterviews}
                        icon={Calendar}
                    />

                    <StatsCard
                        title="Offers"
                        value={summary.offers}
                        icon={CalendarCheck}
                    />

                    <StatsCard
                        title="Hires"
                        value={summary.hires}
                        icon={Star}
                    />

                </div>

                <div className="grid gap-6 md:grid-cols-3">

                    <StatsCard
                        title="Hiring Success Rate"
                        value={`${metrics.hiringSuccessRate}%`}
                        icon={CalendarCheck}
                        description="Hired vs. hired + rejected"
                    />

                    <StatsCard
                        title="Time To Hire"
                        value={`${metrics.timeToHire}d`}
                        icon={Calendar}
                        description="Average days from application to hire"
                    />

                    <StatsCard
                        title="Interviews Today"
                        value={metrics.interviewsToday}
                        icon={CalendarX}
                    />

                </div>

            </DashboardSection>

            <div className="grid gap-6 lg:grid-cols-2">

                <HiringPipeline
                    data={funnel.stages.map(s => ({ stage: s.stage, value: s.count, percentage: s.percentage }))}
                />

                <UpcomingInterviews
                    interviews={interviewStats.upcomingInterviews ?? []}
                />

            </div>

            <RecentActivityFeed
                events={activity.events}
            />

            <DashboardSection title="Quick Actions">

                <DashboardQuickActions />

            </DashboardSection>

            <DashboardSection title="Jobs">

                <JobsOverviewSection
                    published={jobsOverview.published}
                    draft={jobsOverview.draft}
                    closed={jobsOverview.closed}
                    archived={jobsOverview.archived}
                    statusData={jobsOverview.statusData}
                    topDepartments={jobsOverview.topDepartments}
                    topLocations={jobsOverview.topLocations}
                    mostActiveCompanies={jobsOverview.mostActiveCompanies}
                />

            </DashboardSection>

            <DashboardSection title="Candidates">

                <CandidatesOverviewSection
                    activeCount={candidatesOverview.activeCount}
                    archivedCount={candidatesOverview.archivedCount}
                    byStage={candidatesOverview.byStage}
                    byExperience={candidatesOverview.byExperience}
                    recentCandidates={candidatesOverview.recentCandidates}
                />

                <DashboardLineChart
                    title="Hiring Trend (last 6 months)"
                    data={candidatesOverview.hiringTrend}
                    categoryKey="month"
                />

            </DashboardSection>

            <DashboardSection title="Companies">

                <div className="grid gap-6 md:grid-cols-2">

                    <StatsCard
                        title="Active Companies"
                        value={companyStats.activeCount}
                        icon={Building2}
                    />

                    <StatsCard
                        title="Archived Companies"
                        value={companyStats.archivedCount}
                        icon={Archive}
                    />

                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    <CompaniesByIndustryChart
                        data={companyStats.byIndustry ?? []}
                    />

                    <CompaniesBySizeChart
                        data={companyStats.bySize ?? []}
                    />

                </div>

                <TopCompaniesList
                    companies={companyStats.topCompanies ?? []}
                />

            </DashboardSection>

            <DashboardSection title="Interviews">

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <StatsCard
                        title="Interviews Today"
                        value={interviewStats.interviewsTodayCount ?? 0}
                        icon={Calendar}
                    />

                    <StatsCard
                        title="Completed Interviews"
                        value={interviewStats.completedCount ?? 0}
                        icon={CalendarCheck}
                    />

                    <StatsCard
                        title="Cancelled Interviews"
                        value={interviewStats.cancelledCount ?? 0}
                        icon={CalendarX}
                    />

                    <StatsCard
                        title="Average Interview Score"
                        value={interviewStats.averageScore ?? 0}
                        icon={Star}
                    />

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    <StatsCard
                        title="Interviews Tomorrow"
                        value={interviewsOverview.tomorrow}
                        icon={Calendar}
                    />

                    <StatsCard
                        title="Interviews This Week"
                        value={interviewsOverview.thisWeek}
                        icon={Calendar}
                    />

                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    <InterviewFunnelChart
                        data={interviewStats.byStage ?? []}
                    />

                    <DashboardBarChart
                        title="Interviews Per Week"
                        data={interviewsOverview.perWeek}
                        categoryKey="week"
                    />

                </div>

            </DashboardSection>

        </div>

    );

}
