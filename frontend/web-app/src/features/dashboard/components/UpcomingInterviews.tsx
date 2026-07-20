import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

type Interview = {

    id: number;

    candidate: string;

    date: string;

};

type Props = {

    interviews: Interview[];

};

export function UpcomingInterviews({
    interviews,
}: Props) {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Upcoming Interviews

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="space-y-4">

                    {interviews.map(interview => (

                        <div
                            key={interview.id}
                            className="flex items-center justify-between border-b pb-3"
                        >

                            <span>

                                {interview.candidate}

                            </span>

                            <span className="text-sm text-muted-foreground">

                                {interview.date}

                            </span>

                        </div>

                    ))}

                </div>

            </CardContent>

        </Card>

    );

}