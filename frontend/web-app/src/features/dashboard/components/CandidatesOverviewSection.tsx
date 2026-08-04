import { UserCheck, Archive } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import type { Candidate } from "@/features/candidates/models/Candidate";

import { StatsCard } from "./StatsCard";
import { RecentCandidates } from "./RecentCandidates";
import { DashboardBarChart } from "./charts/DashboardBarChart";

type Props = {
    activeCount: number;
    archivedCount: number;
    byStage: { stage: string; value: number }[];
    byExperience: { label: string; value: number }[];
    recentCandidates: Candidate[];
};

export function CandidatesOverviewSection({
    activeCount,
    archivedCount,
    byStage,
    byExperience,
    recentCandidates,
}: Props) {

    return (

        <div className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2">

                <StatsCard title="Active Candidates" value={activeCount} icon={UserCheck} />

                <StatsCard title="Archived Candidates" value={archivedCount} icon={Archive} />

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <DashboardBarChart title="Candidates By Stage" data={byStage} categoryKey="stage" />

                <DashboardBarChart title="Candidates By Experience" data={byExperience} categoryKey="label" />

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <Card>

                    <CardHeader>
                        <CardTitle>Top Skills</CardTitle>
                    </CardHeader>

                    <CardContent>

                        <EmptyState
                            title="Coming soon"
                            description="Skill aggregation isn't available yet."
                        />

                    </CardContent>

                </Card>

                <RecentCandidates candidates={recentCandidates} />

            </div>

        </div>

    );

}
