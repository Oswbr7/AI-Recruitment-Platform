import { useMemo } from "react";

import { JobStatus } from "@/features/jobs/models/Job";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

export function useJobsOverview() {

    const { jobs, companies, isLoading } = useDashboardSourceData();

    const overview = useMemo(() => {

        const published = jobs.filter(job => job.status === JobStatus.Published).length;

        const draft = jobs.filter(job => job.status === JobStatus.Draft).length;

        const closed = jobs.filter(job => job.status === JobStatus.Closed).length;

        const archived = jobs.filter(job => job.status === JobStatus.Archived).length;

        const byDepartment = new Map<string, number>();

        const byLocation = new Map<string, number>();

        for (const job of jobs) {

            byDepartment.set(job.department, (byDepartment.get(job.department) ?? 0) + 1);

            byLocation.set(job.location, (byLocation.get(job.location) ?? 0) + 1);

        }

        const topDepartments = [...byDepartment.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }));

        const topLocations = [...byLocation.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }));

        const openJobsByCompany = new Map<string, number>();

        for (const job of jobs)
            if (job.companyId)
                openJobsByCompany.set(job.companyId, (openJobsByCompany.get(job.companyId) ?? 0) + 1);

        const mostActiveCompanies = [...companies]
            .map(company => ({ company, openJobs: openJobsByCompany.get(company.id) ?? 0 }))
            .sort((a, b) => b.openJobs - a.openJobs)
            .slice(0, 5);

        const statusData = [
            { status: "Published", value: published },
            { status: "Draft", value: draft },
            { status: "Closed", value: closed },
            { status: "Archived", value: archived },
        ];

        return {

            published,

            draft,

            closed,

            archived,

            topDepartments,

            topLocations,

            mostActiveCompanies,

            statusData,

        };

    }, [jobs, companies]);

    return { ...overview, isLoading };

}
