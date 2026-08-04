import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import type { RankedItem } from "../models/DashboardModels";

type Props = {
    title: string;
    items: RankedItem[];
};

export function RankedList({ title, items }: Props) {

    return (

        <Card>

            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>

                {items.length === 0 ? (

                    <EmptyState
                        title="No data yet"
                        description="Data will appear here once available."
                    />

                ) : (

                    <ul className="space-y-3">

                        {items.map(item => (

                            <li key={item.label} className="flex items-center justify-between text-sm">

                                <span>{item.label}</span>

                                <span className="font-medium text-muted-foreground">{item.value}</span>

                            </li>

                        ))}

                    </ul>

                )}

            </CardContent>

        </Card>

    );

}
