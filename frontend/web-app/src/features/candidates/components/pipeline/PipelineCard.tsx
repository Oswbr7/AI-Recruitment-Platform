import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "../../models/Candidate";

interface Props {

    candidate: Candidate;

}

export function PipelineCard({
    candidate,
}: Props) {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: candidate.id,
    });

    const style = transform
        ? { transform: CSS.Translate.toString(transform) }
        : undefined;

    return (

        <Card
            ref={setNodeRef}
            style={style}
            size="sm"
            className={`cursor-grab touch-none select-none active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
            {...listeners}
            {...attributes}
        >

            <CardContent>

                <p className="text-sm font-medium">
                    {candidate.firstName} {candidate.lastName}
                </p>

                <p className="text-xs text-muted-foreground">
                    {candidate.headline || candidate.currentPosition || "—"}
                </p>

                <p className="text-xs text-muted-foreground">
                    {candidate.email}
                </p>

            </CardContent>

        </Card>

    );

}
