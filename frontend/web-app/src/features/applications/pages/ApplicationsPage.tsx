import { useMemo, useState } from "react";

import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";

import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { useJobs } from "@/features/jobs/hooks/useJobs";

import { ApplicationStatus } from "../types/Application";
import { useApplications } from "../hooks/useApplications";
import { ApplicationsTable } from "../components/ApplicationsTable";

export function ApplicationsPage() {
    const [jobFilter, setJobFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const params = {
        pageSize: 100,
        ...(jobFilter ? { jobId: jobFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
    };

    const { data, isLoading } = useApplications(params);
    const { data: candidatesData } = useCandidates({ page: 1, pageSize: 100 });
    const { data: jobs } = useJobs();

    const candidateName = useMemo(() => {
        const map = new Map(
            (candidatesData?.items ?? []).map((c) => [c.id, `${c.firstName} ${c.lastName}`]),
        );
        return (id: string) => map.get(id) ?? "Unknown";
    }, [candidatesData]);

    const jobTitle = useMemo(() => {
        const map = new Map((jobs ?? []).map((j) => [j.id, j.title]));
        return (id: string) => map.get(id) ?? "Unknown";
    }, [jobs]);

    return (
        <PageContainer>
            <PageHeader
                title="Applications"
                description="Candidate-to-job pipeline: review, interview, offer or reject."
            />

            <div className="mb-6 flex items-center gap-4">
                <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                >
                    <option value="">All jobs</option>

                    {(jobs ?? []).map((job) => (
                        <option key={job.id} value={job.id}>
                            {job.title}
                        </option>
                    ))}
                </select>

                <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All statuses</option>

                    {Object.values(ApplicationStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                {data && (
                    <span className="text-sm text-muted-foreground">
                        {data.totalCount} application{data.totalCount === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            <ApplicationsTable
                applications={data?.items}
                isLoading={isLoading}
                candidateName={candidateName}
                jobTitle={jobTitle}
            />
        </PageContainer>
    );
}
