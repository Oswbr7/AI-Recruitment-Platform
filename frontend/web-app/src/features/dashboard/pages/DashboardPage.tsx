import { Archive, BrainCircuit, BriefcaseBusiness, Building2, Calendar, CalendarCheck, CalendarX, Star, Users } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { HiringPipeline } from "../components/HiringPipeline";
import { RecentCandidates } from "../components/RecentCandidates";
import { StatsCard } from "../components/StatsCard";
import { UpcomingInterviews } from "../components/UpcomingInterviews";
import { CompaniesByIndustryChart } from "../components/CompaniesByIndustryChart";
import { CompaniesBySizeChart } from "../components/CompaniesBySizeChart";
import { TopCompaniesList } from "../components/TopCompaniesList";
import { InterviewFunnelChart } from "../components/InterviewFunnelChart";
import { useDashboard } from "../hooks/useDashboard";
import { useCompanyDashboardStats } from "../hooks/useCompanyDashboardStats";
import { useInterviewDashboardStats } from "../hooks/useInterviewDashboardStats";

export function DashboardPage() {

    const { data, isLoading } = useDashboard();

    const companyStats = useCompanyDashboardStats();

    const interviewStats = useInterviewDashboardStats();

    if (isLoading || !data)
        return <DashboardSkeleton />;

    return (

        <div className="space-y-8">

            <DashboardHeader />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatsCard
                    title="Active Jobs"
                    value={data.stats.activeJobs}
                    icon={BriefcaseBusiness}
                />

                <StatsCard
                    title="Candidates"
                    value={data.stats.candidates}
                    icon={Users}
                />

                <StatsCard
                    title="Interviews"
                    value={data.stats.interviews}
                    icon={Calendar}
                />

                <StatsCard
                    title="AI Score"
                    value={`${data.stats.aiScore}%`}
                    icon={BrainCircuit}
                />

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <HiringPipeline
                    data={data.pipeline}
                />

                <UpcomingInterviews
                    interviews={interviewStats.upcomingInterviews ?? []}
                />

            </div>

            <RecentCandidates
                candidates={data.recentCandidates}
            />

            <div className="space-y-6">

                <h2 className="text-xl font-semibold tracking-tight">Companies</h2>

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

            </div>

            <div className="space-y-6">

                <h2 className="text-xl font-semibold tracking-tight">Interviews</h2>

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

                <InterviewFunnelChart
                    data={interviewStats.byStage ?? []}
                />

            </div>

        </div>

    );

}