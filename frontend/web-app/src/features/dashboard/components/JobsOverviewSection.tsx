import { Rocket, FileText, Ban, Archive } from "lucide-react";

import type { Company } from "@/features/companies/models/Company";

import { StatsCard } from "./StatsCard";
import { RankedList } from "./RankedList";
import { TopCompaniesList } from "./TopCompaniesList";
import { DashboardBarChart } from "./charts/DashboardBarChart";
import type { RankedItem } from "../models/DashboardModels";

type Props = {
    published: number;
    draft: number;
    closed: number;
    archived: number;
    statusData: { status: string; value: number }[];
    topDepartments: RankedItem[];
    topLocations: RankedItem[];
    mostActiveCompanies: { company: Company; openJobs: number }[];
};

export function JobsOverviewSection({
    published,
    draft,
    closed,
    archived,
    statusData,
    topDepartments,
    topLocations,
    mostActiveCompanies,
}: Props) {

    return (

        <div className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatsCard title="Published" value={published} icon={Rocket} />

                <StatsCard title="Draft" value={draft} icon={FileText} />

                <StatsCard title="Closed" value={closed} icon={Ban} />

                <StatsCard title="Archived" value={archived} icon={Archive} />

            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                <DashboardBarChart title="Jobs By Status" data={statusData} categoryKey="status" />

                <RankedList title="Top Departments" items={topDepartments} />

                <RankedList title="Top Locations" items={topLocations} />

            </div>

            <TopCompaniesList companies={mostActiveCompanies} />

        </div>

    );

}
