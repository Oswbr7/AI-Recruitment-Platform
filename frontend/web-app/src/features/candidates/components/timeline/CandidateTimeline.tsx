import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CandidateStatus, type Candidate } from "../../models/Candidate";
import type { CandidateNote } from "../../models/CandidateNote";

interface TimelineEvent {

    id: string;

    label: string;

    at: Date;

}

interface Props {

    candidate: Candidate;

    notes: CandidateNote[];

}

export function CandidateTimeline({
    candidate,
    notes,
}: Props) {

    const events: TimelineEvent[] = [

        { id: "created", label: "Candidate Created", at: candidate.createdAt },

        ...notes.map(note => ({
            id: `note-${note.id}`,
            label: "Note Added",
            at: note.createdAt,
        })),

        { id: "stage", label: `Currently in stage: ${candidate.stage}`, at: candidate.updatedAt },

    ];

    if (candidate.status === CandidateStatus.Archived) {

        events.push({ id: "archived", label: "Archived", at: candidate.updatedAt });

    }

    events.sort((a, b) => b.at.getTime() - a.at.getTime());

    return (

        <Card>

            <CardHeader>
                <CardTitle>Timeline</CardTitle>
            </CardHeader>

            <CardContent>

                <ul className="space-y-4">

                    {events.map(event => (

                        <li key={event.id} className="border-l-2 border-muted pl-4">

                            <p className="text-sm font-medium">{event.label}</p>

                            <p className="text-xs text-muted-foreground">
                                {event.at.toLocaleString()}
                            </p>

                        </li>

                    ))}

                </ul>

            </CardContent>

        </Card>

    );

}
