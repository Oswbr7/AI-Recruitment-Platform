import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import type { ActivityEvent } from "../models/DashboardModels";

type Props = {
    events: ActivityEvent[];
};

export function RecentActivityFeed({ events }: Props) {

    return (

        <Card>

            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent>

                {events.length === 0 ? (

                    <EmptyState
                        title="No recent activity"
                        description="Activity across the platform will show up here."
                    />

                ) : (

                    <ul className="space-y-4">

                        {events.map(event => (

                            <li key={event.id} className="flex items-start gap-3">

                                <event.icon className={`mt-0.5 h-4 w-4 shrink-0 ${event.color}`} />

                                <div className="flex-1">

                                    <p className="text-sm font-medium">{event.title}</p>

                                    {event.description && (
                                        <p className="text-xs text-muted-foreground">{event.description}</p>
                                    )}

                                </div>

                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {formatDistanceToNow(event.createdAt, { addSuffix: true })}
                                </span>

                            </li>

                        ))}

                    </ul>

                )}

            </CardContent>

        </Card>

    );

}
