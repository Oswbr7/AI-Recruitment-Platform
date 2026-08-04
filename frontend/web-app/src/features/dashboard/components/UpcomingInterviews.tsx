import { useNavigate } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

export interface UpcomingInterviewItem {

    id: string;

    candidateName: string;

    scheduledAt: Date;

}

type Props = {

    interviews: UpcomingInterviewItem[];

};

export function UpcomingInterviews({
    interviews,
}: Props) {

    const navigate = useNavigate();

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Upcoming Interviews

                </CardTitle>

            </CardHeader>

            <CardContent>

                {interviews.length === 0 ? (

                    <EmptyState
                        title="No upcoming interviews"
                        description="Scheduled interviews will appear here."
                    />

                ) : (

                    <div className="space-y-4">

                        {interviews.map(interview => (

                            <button
                                key={interview.id}
                                onClick={() => navigate(`/interviews/${interview.id}`)}
                                className="flex w-full items-center justify-between border-b pb-3 text-left last:border-0 last:pb-0 hover:opacity-80"
                            >

                                <span>

                                    {interview.candidateName}

                                </span>

                                <span className="text-sm text-muted-foreground">

                                    {interview.scheduledAt.toLocaleString()}

                                </span>

                            </button>

                        ))}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}
