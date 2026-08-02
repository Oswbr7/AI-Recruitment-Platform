import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

                        <p className="text-sm font-medium text-muted-foreground">
                            Description
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {job.description}
                        </p>

                    </div>

                </CardContent>

            </Card>

            <JobSheet
                job={job}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

        </div>

    );

}

function DetailField({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {

    return (

        <div>

            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <p className="mt-1 text-sm">{value || "—"}</p>

        </div>

    );

}
