import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

interface Props {

    title: string;

}

export function PlaceholderSection({
    title,
}: Props) {

    return (

        <Card>

            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>

                <EmptyState
                    title="Coming soon"
                    description={`${title} tracking will be available in a future update.`}
                />

            </CardContent>

        </Card>

    );

}
