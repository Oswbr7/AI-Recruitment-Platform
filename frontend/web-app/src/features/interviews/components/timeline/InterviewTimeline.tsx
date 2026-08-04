import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InterviewStatus, type Interview } from "../../models/Interview";
import type { InterviewFeedback } from "../../models/InterviewFeedback";

interface TimelineEvent {

    id: string;

    label: string;

    at: Date;

}

interface Props {

    interview: Interview;

    feedback: InterviewFeedback[];

}

export function InterviewTimeline({
    interview,
    feedback,
}: Props) {

    const events: TimelineEvent[] = [

        { id: "scheduled", label: "Interview Scheduled", at: interview.createdAt },

        ...feedback.map(item => ({
            id: `feedback-${item.id}`,
            label: "Feedback Submitted",
            at: item.createdAt,
        })),

    ];

    if (interview.updatedAt.getTime() !== interview.createdAt.getTime()) {

        events.push({ id: "updated", label: "Interview Updated", at: interview.updatedAt });

    }

    if (interview.status === InterviewStatus.Completed) {

        events.push({ id: "completed", label: "Interview Completed", at: interview.updatedAt });

    }

    if (interview.status === InterviewStatus.Cancelled) {

        events.push({ id: "cancelled", label: "Interview Cancelled", at: interview.updatedAt });

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
