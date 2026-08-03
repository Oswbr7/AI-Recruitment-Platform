import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useCandidateDetail } from "../hooks/useCandidateDetail";
import { useCandidateNotes } from "../hooks/useCandidateNotes";
import { CandidateStageBadge } from "../components/badges/CandidateStageBadge";
import { CandidateStatusBadge } from "../components/badges/CandidateStatusBadge";
import { CandidateActionsMenu } from "../components/actions/CandidateActionsMenu";
import { CandidateSheet } from "../components/sheet";
import { CandidateTimeline } from "../components/timeline/CandidateTimeline";
import { CandidateNotesSection } from "../components/notes/CandidateNotesSection";
import { PlaceholderSection } from "@/shared/components/PlaceholderSection";

interface Props {

    id: string;

}

export function CandidateDetailView({ id }: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const { data: candidate, isLoading, isError } = useCandidateDetail(id);

    const { data: notes } = useCandidateNotes(id);

    if (isLoading) {

        return (

            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-64 w-full" />
            </div>

        );

    }

    if (isError || !candidate) {

        return (

            <div className="space-y-4">

                <Button variant="ghost" onClick={() => navigate("/candidates")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Candidates
                </Button>

                <p className="text-sm text-muted-foreground">Candidate not found.</p>

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <Button variant="ghost" onClick={() => navigate("/candidates")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Candidates
                </Button>

                <div className="flex items-center gap-2">

                    <Button onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Edit
                    </Button>

                    <CandidateActionsMenu candidate={candidate} />

                </div>

            </div>

            <Card>

                <CardHeader>

                    <div className="flex items-center justify-between">

                        <CardTitle className="text-2xl">
                            {candidate.firstName} {candidate.lastName}
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <CandidateStageBadge stage={candidate.stage} />
                            <CandidateStatusBadge status={candidate.status} />
                        </div>

                    </div>

                </CardHeader>

                <CardContent className="space-y-6">

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailField label="Email" value={candidate.email} />

                        <DetailField label="Phone" value={candidate.phone} />

                        <DetailField label="Location" value={candidate.location} />

                        <DetailField label="Headline" value={candidate.headline} />

                        <DetailField label="Current Company" value={candidate.currentCompany} />

                        <DetailField label="Current Position" value={candidate.currentPosition} />

                        <DetailField
                            label="Years of Experience"
                            value={candidate.yearsOfExperience?.toString()}
                        />

                        <DetailField
                            label="Expected Salary"
                            value={
                                candidate.expectedSalary
                                    ? `${candidate.expectedSalary} ${candidate.currency ?? ""}`
                                    : undefined
                            }
                        />

                        <DetailField label="LinkedIn" value={candidate.linkedInUrl} />

                        <DetailField label="GitHub" value={candidate.githubUrl} />

                        <DetailField label="Portfolio" value={candidate.portfolioUrl} />

                    </div>

                    <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Summary
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {candidate.summary || "—"}
                        </p>

                    </div>

                </CardContent>

            </Card>

            <CandidateTimeline candidate={candidate} notes={notes ?? []} />

            <CandidateNotesSection candidateId={candidate.id} />

            <div className="grid gap-6 sm:grid-cols-3">

                <PlaceholderSection title="Skills" />

                <PlaceholderSection title="Experience" />

                <PlaceholderSection title="Education" />

            </div>

            <CandidateSheet
                candidate={candidate}
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
