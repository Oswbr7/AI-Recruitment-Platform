import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useCandidates } from "../hooks/useCandidates";
import { useMoveCandidateStage } from "../hooks/useMoveCandidateStage";
import { CandidateStage, CandidateStatus } from "../models/Candidate";
import { PipelineColumn } from "../components/pipeline/PipelineColumn";

const columns: { stage: CandidateStage; title: string }[] = [

    { stage: CandidateStage.Applied, title: "Applied" },

    { stage: CandidateStage.Screening, title: "Screening" },

    { stage: CandidateStage.TechnicalInterview, title: "Technical" },

    { stage: CandidateStage.HRInterview, title: "HR" },

    { stage: CandidateStage.Offer, title: "Offer" },

    { stage: CandidateStage.Hired, title: "Hired" },

    { stage: CandidateStage.Rejected, title: "Rejected" },

];

export function CandidatePipelineView() {

    const navigate = useNavigate();

    const { data, isLoading, isError } = useCandidates({ pageSize: 200 });

    const moveStage = useMoveCandidateStage();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const activeCandidates = useMemo(
        () => (data?.items ?? []).filter(candidate => candidate.status === CandidateStatus.Active),
        [data]
    );

    const handleDragEnd = (event: DragEndEvent) => {

        const { active, over } = event;

        if (!over)
            return;

        const candidateId = active.id as string;

        const newStage = over.id as CandidateStage;

        const candidate = activeCandidates.find(c => c.id === candidateId);

        if (!candidate || candidate.stage === newStage)
            return;

        moveStage.mutate({ id: candidateId, stage: newStage });

    };

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>

                    <p className="text-muted-foreground">Drag candidates between stages.</p>

                </div>

                <Button variant="outline" onClick={() => navigate("/candidates")}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Candidates
                </Button>

            </div>

            {isLoading ? (

                <div className="flex gap-4 overflow-x-auto">

                    {columns.map(col => (
                        <Skeleton key={col.stage} className="h-96 w-72 shrink-0" />
                    ))}

                </div>

            ) : isError ? (

                <div className="flex flex-col items-center py-20 text-center">

                    <h3 className="text-xl font-semibold">Unable to load the pipeline</h3>

                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>

                </div>

            ) : activeCandidates.length === 0 ? (

                <EmptyState
                    title="No candidates"
                    description="Active candidates will appear here once created."
                />

            ) : (

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                    <div className="flex gap-4 overflow-x-auto pb-4">

                        {columns.map(col => (

                            <PipelineColumn
                                key={col.stage}
                                stage={col.stage}
                                title={col.title}
                                candidates={activeCandidates.filter(c => c.stage === col.stage)}
                            />

                        ))}

                    </div>

                </DndContext>

            )}

        </div>

    );

}
