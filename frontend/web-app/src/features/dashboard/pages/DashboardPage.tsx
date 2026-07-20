import { BrainCircuit, BriefcaseBusiness, Calendar, Users } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { HiringPipeline } from "../components/HiringPipeline";
import { RecentCandidates } from "../components/RecentCandidates";
import { StatsCard } from "../components/StatsCard";
import { UpcomingInterviews } from "../components/UpcomingInterviews";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {

    const { data, isLoading } = useDashboard();

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
                    interviews={data.upcomingInterviews}
                />

            </div>

            <RecentCandidates
                candidates={data.recentCandidates}
            />

        </div>

    );

}