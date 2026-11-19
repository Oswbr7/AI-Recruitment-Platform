import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useApplications } from "@/features/applications/hooks/useApplications";
import { useMyApplications } from "@/features/applications/hooks/useApplications";
import { useSubmitApplication } from "@/features/applications/hooks/useApplications";
import { ApplicationsTable } from "@/features/applications/components/ApplicationsTable";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { useMyProfile } from "@/features/candidates/hooks/useMyProfile";
import { useAuthStore } from "@/features/auth/store/authStore";

import { useJobDetail } from "../hooks/useJobDetail";
import { JobStatusBadge } from "../components/badges/JobStatusBadge";
import { JobActionsMenu } from "../components/actions/JobActionsMenu";
import { JobSheet } from "../components/sheet";

interface Props {
    id: string;
}

export function JobDetailView({ id }: Props) {
    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const { data: job, isLoading, isError } = useJobDetail(id);

    const { data: applicationsData, isLoading: applicationsLoading } = useApplications({
        jobId: id,
        pageSize: 100,
    });
    const { data: candidatesData } = useCandidates({ page: 1, pageSize: 100 });

    // Apply: solo rol Candidate, con perfil propio creado y sin aplicar aun.
    const role = useAuthStore((s) => s.user?.role);
    const { data: myProfile } = useMyProfile();
    const { data: myApplications } = useMyApplications();
    const submitApplication = useSubmitApplication();

    const isCandidate = role === "Candidate";
    const alreadyApplied = isCandidate && (myApplications?.items ?? []).some((a) => a.jobId === id);

    function handleApply() {
        if (!myProfile) return;

        submitApplication.mutate(
            {
                candidateId: myProfile.id,
                jobId: id,
                source: "Portal",
            },
            {
                onSuccess: () => toast.success("Application submitted!"),
                onError: (error: any) =>
                    toast.error(
                        error?.response?.status === 409
                            ? "You already applied to this job."
                            : "Could not submit the application.",
                    ),
            },
        );
    }

    const candidateName = (candidateId: string) => {
        const candidate = candidatesData?.items.find((c) => c.id === candidateId);
        return candidate ? `${candidate.firstName} ${candidate.lastName}` : "Unknown";
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => navigate("/jobs")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Jobs
                </Button>

                <p className="text-sm text-muted-foreground">Job not found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/jobs")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Jobs
                </Button>

                <div className="flex items-center gap-2">
                    {isCandidate && myProfile && !alreadyApplied && (
                        <Button onClick={handleApply} disabled={submitApplication.isPending}>
                            <Send className="mr-1.5 h-4 w-4" />
                            Apply
                        </Button>
                    )}

                    {isCandidate && alreadyApplied && (
                        <Button variant="outline" disabled>
                            Applied
                        </Button>
                    )}

                    <Button onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Edit
                    </Button>

                    <JobActionsMenu job={job} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">{job.title}</CardTitle>

                        <JobStatusBadge status={job.status} />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DetailField label="Department" value={job.department} />

                        <DetailField label="Location" value={job.location} />

                        <DetailField label="Employment Type" value={job.employmentType} />

                        <DetailField label="Experience Level" value={job.experienceLevel} />

                        <DetailField label="Remote Type" value={job.remoteType} />

                        <DetailField
                            label="Salary Range"
                            value={
                                job.salaryMin || job.salaryMax
                                    ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"} ${job.currency ?? ""}`
                                    : "Not specified"
                            }
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">{job.description}</p>
                    </div>
                </CardContent>
            </Card>

            {!isCandidate && (
                <Card>
                    <CardHeader>
                        <CardTitle>Applicants</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ApplicationsTable
                            applications={applicationsData?.items}
                            isLoading={applicationsLoading}
                            candidateName={candidateName}
                            emptyTitle="No applicants yet"
                            emptyDescription="Applications submitted for this job will appear here."
                        />
                    </CardContent>
                </Card>
            )}

            <JobSheet job={job} open={editOpen} onOpenChange={setEditOpen} />
        </div>
    );
}

function DetailField({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <p className="mt-1 text-sm">{value || "—"}</p>
        </div>
    );
}
