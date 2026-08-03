import { useDroppable } from "@dnd-kit/core";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Candidate, CandidateStage } from "../../models/Candidate";
import { PipelineCard } from "./PipelineCard";

interface Props {

    stage: CandidateStage;

    title: string;

    candidates: Candidate[];

}

export function PipelineColumn({
    stage,
    title,
    candidates,
}: Props) {

    const { setNodeRef, isOver } = useDroppable({ id: stage });

    return (

        <div ref={setNodeRef} className="flex w-72 shrink-0 flex-col">

            <Card className={cn("h-full", isOver && "ring-2 ring-primary")}>

                <CardHeader>

                    <CardTitle className="flex items-center justify-between text-sm">

                        <span>{title}</span>

                        <span className="text-muted-foreground">{candidates.length}</span>

                    </CardTitle>

                </CardHeader>

                <CardContent className="flex min-h-24 flex-col gap-2">

                    {candidates.map(candidate => (
                        <PipelineCard key={candidate.id} candidate={candidate} />
                    ))}

                </CardContent>

            </Card>

        </div>

    );

}
