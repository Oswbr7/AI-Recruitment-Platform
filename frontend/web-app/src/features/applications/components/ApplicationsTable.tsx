import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { LoadingSpinner } from "@/shared/components/loading/LoadingSpinner";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { ApplicationStatus } from "../types/Application";
import type { Application, ApplicationSource } from "../types/Application";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { useApplicationTransition } from "../hooks/useApplications";

const TERMINAL: string[] = [ApplicationStatus.Rejected, ApplicationStatus.Withdrawn];

/** Transiciones disponibles por estado — espejo de la máquina de estados del dominio. */
const ACTIONS: Record<
    string,
    { transition: string; label: string; variant?: "destructive" | "outline" }[]
> = {
    Applied: [
        { transition: "start-review", label: "Start review" },
        { transition: "reject", label: "Reject", variant: "destructive" },
        { transition: "withdraw", label: "Withdraw", variant: "outline" },
    ],
    Reviewing: [
        { transition: "to-interviewing", label: "To interviewing" },
        { transition: "reject", label: "Reject", variant: "destructive" },
        { transition: "withdraw", label: "Withdraw", variant: "outline" },
    ],
    Interviewing: [
        { transition: "offer", label: "Offer" },
        { transition: "reject", label: "Reject", variant: "destructive" },
        { transition: "withdraw", label: "Withdraw", variant: "outline" },
    ],
    Offered: [
        { transition: "reject", label: "Reject", variant: "destructive" },
        { transition: "withdraw", label: "Withdraw", variant: "outline" },
    ],
};

/** El candidato solo puede retirarse de lo suyo. */
const CANDIDATE_ACTIONS: Record<
    string,
    { transition: string; label: string; variant?: "destructive" | "outline" }[]
> = {
    Applied: [{ transition: "withdraw", label: "Withdraw application", variant: "outline" }],
    Reviewing: [{ transition: "withdraw", label: "Withdraw application", variant: "outline" }],
    Interviewing: [{ transition: "withdraw", label: "Withdraw application", variant: "outline" }],
    Offered: [{ transition: "withdraw", label: "Withdraw application", variant: "outline" }],
};

interface Props {
    applications: Application[] | undefined;

    isLoading: boolean;

    /** Resuelve ids a nombres (candidatos/vacantes se traen del hook padre). */
    candidateName?: (id: string) => string;

    jobTitle?: (id: string) => string;

    emptyTitle?: string;

    emptyDescription?: string;

    /** "recruiter" (default): gestion completa. "candidate": solo Withdraw. */
    actionsMode?: "recruiter" | "candidate";
}

export function ApplicationsTable({
    applications,
    isLoading,
    candidateName,
    jobTitle,
    emptyTitle = "No applications yet",
    emptyDescription = "Submitted applications will appear here.",
    actionsMode = "recruiter",
}: Props) {
    const transition = useApplicationTransition();

    if (isLoading) return <LoadingSpinner />;

    if (!applications || applications.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    function handleTransition(id: string, name: string, action: string) {
        transition.mutate(
            { id, transition: action as never },
            {
                onSuccess: () => toast.success(`Application moved: ${name}`),
                onError: (error: any) =>
                    toast.error(
                        error?.response?.data?.detail ?? "Could not update the application.",
                    ),
            },
        );
    }

    function actionsFor(status: string) {
        return actionsMode === "candidate"
            ? (CANDIDATE_ACTIONS[status] ?? [])
            : (ACTIONS[status] ?? []);
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {candidateName && <TableHead>Candidate</TableHead>}
                        {jobTitle && <TableHead>Job</TableHead>}
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {applications.map((application) => (
                        <TableRow key={application.id}>
                            {candidateName && (
                                <TableCell className="font-medium">
                                    {candidateName(application.candidateId)}
                                </TableCell>
                            )}

                            {jobTitle && <TableCell>{jobTitle(application.jobId)}</TableCell>}

                            <TableCell>
                                <ApplicationStatusBadge status={application.status} />
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {(application.source as ApplicationSource | undefined) ?? "—"}
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {application.appliedAt.toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                {!TERMINAL.includes(application.status) && (
                                    <div className="flex gap-2">
                                        {actionsFor(application.status).map((action) => (
                                            <Button
                                                key={action.transition}
                                                size="sm"
                                                variant={action.variant ?? "default"}
                                                disabled={transition.isPending}
                                                onClick={() =>
                                                    handleTransition(
                                                        application.id,
                                                        action.label,
                                                        action.transition,
                                                    )
                                                }
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
