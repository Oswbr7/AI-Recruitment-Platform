import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import type { Interview } from "../../models/Interview";
import { InterviewStatusBadge } from "../badges/InterviewStatusBadge";

interface Props {

    date: Date;

    isCurrentMonth: boolean;

    isToday: boolean;

    interviews: Interview[];

}

export function CalendarDayCell({
    date,
    isCurrentMonth,
    isToday,
    interviews,
}: Props) {

    const navigate = useNavigate();

    return (

        <div
            className={cn(
                "flex min-h-28 flex-col gap-1 border-b border-r p-2",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground"
            )}
        >

            <span
                className={cn(
                    "text-xs font-medium",
                    isToday && "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                )}
            >
                {date.getDate()}
            </span>

            <div className="flex flex-col gap-1 overflow-y-auto">

                {interviews.map(interview => (

                    <button
                        key={interview.id}
                        onClick={() => navigate(`/interviews/${interview.id}`)}
                        className="rounded-md border bg-card px-1.5 py-1 text-left text-xs hover:bg-accent"
                    >

                        <p className="truncate font-medium">{interview.title}</p>

                        <div className="mt-0.5 flex items-center justify-between">

                            <span className="text-muted-foreground">
                                {interview.scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>

                            <InterviewStatusBadge status={interview.status} />

                        </div>

                    </button>

                ))}

            </div>

        </div>

    );

}
