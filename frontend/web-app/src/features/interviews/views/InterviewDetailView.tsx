import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useCandidateDetail } from "@/features/candidates/hooks/useCandidateDetail";
import { useJobDetail } from "@/features/jobs/hooks/useJobDetail";

import { useInterviewDetail } from "../hooks/useInterviewDetail";
import { useInterviewFeedback } from "../hooks/useInterviewFeedback";
import { useRecruiters } from "../hooks/useRecruiters";
import { InterviewStageBadge } from "../components/badges/InterviewStageBadge";
import { InterviewStatusBadge } from "../components/badges/InterviewStatusBadge";
import { InterviewActionsMenu } from "../components/actions/InterviewActionsMenu";
import { InterviewSheet } from "../components/sheet";
import { InterviewFeedbackSection } from "../components/feedback/InterviewFeedbackSection";
import { InterviewTimeline } from "../components/timeline/InterviewTimeline";

interface Props {

    id: string;

}

export function InterviewDetailView({ id }: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const { data: interview, isLoading, isError } = useInterviewDetail(id);

    const { data: candidate } = useCandidateDetail(interview?.candidateId ?? "");

    const { data: job } = useJobDetail(interview?.jobId ?? "");

    const { data: recruiters } = useRecruiters();

    const { data: feedback } = useInterviewFeedback(id);

    const recruiter = recruiters?.find(r => r.id === interview?.recruiterId);

    if (isLoading) {

        return (

            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-64 w-full" />
            </div>

        );

    }

    if (isError || !interview) {

        return (

            <div className="space-y-4">

                <Button variant="ghost" onClick={() => navigate("/interviews")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Interviews
                </Button>

                <p className="text-sm text-muted-foreground">Interview not found.</p>

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <Button variant="ghost" onClick={() => navigate("/interviews")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Interviews
                </Button>

                <div className="flex items-center gap-2">

                    <Button onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Edit
                    </Button>

                    <InterviewActionsMenu interview={interview} />

                </div>

            </div>

            <Card>

                <CardHeader>

                    <div className="flex items-center justify-between">

                        <CardTitle className="text-2xl">{interview.title}</CardTitle>

                        <div className="flex items-center gap-2">
                            <InterviewStageBadge stage={interview.interviewStage} />
                            <InterviewStatusBadge status={interview.status} />
                        </div>

                    </div>

                </CardHeader>

                <CardContent className="space-y-6">

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailField
                            label="Candidate"
                            value={candidate ? `${candidate.firstName} ${candidate.lastName}` : undefined}
                        />

                        <DetailField label="Job" value={job?.title} />

                        <DetailField
                            label="Recruiter"
                            value={recruiter ? `${recruiter.firstName} ${recruiter.lastName}` : undefined}
                        />

                        <DetailField label="Interview Type" value={interview.interviewType} />

                        <DetailField
                            label="Scheduled At"
                            value={interview.scheduledAt.toLocaleString()}
                        />

                        <DetailField
                            label="Duration"
                            value={`${interview.durationMinutes} min`}
                        />

                        <DetailField
                            label="Meeting URL"
                            value={interview.meetingUrl}
                            href={interview.meetingUrl}
                        />

                        <DetailField label="Location" value={interview.location} />

                        <DetailField
                            label="Overall Score"
                            value={interview.overallScore?.toString()}
                        />

                    </div>

                    <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Description
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {interview.description || "—"}
                        </p>

                    </div>

                </CardContent>

            </Card>

            <InterviewFeedbackSection interviewId={interview.id} />

            <InterviewTimeline interview={interview} feedback={feedback ?? []} />

            <InterviewSheet
                interview={interview}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

        </div>

    );

}

function DetailField({
    label,
    value,
    href,
}: {
    label: string;
    value?: string;
    href?: string;
}) {

    return (

        <div>

            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            {href ? (

                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm text-primary underline-offset-4 hover:underline"
                >
                    {value}
                </a>

            ) : (

                <p className="mt-1 text-sm">{value || "—"}</p>

            )}

        </div>

    );

}
