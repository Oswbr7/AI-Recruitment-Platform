import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Candidate = {

    id: number;

    name: string;

    position: string;

    score: number;

};

type Props = {

    candidates: Candidate[];

};

export function RecentCandidates({
    candidates,
}: Props) {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Recent Candidates

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="space-y-4">

                    {candidates.map(candidate => (

                        <div
                            key={candidate.id}
                            className="flex items-center justify-between border-b pb-3"
                        >

                            <div>

                                <h4 className="font-medium">

                                    {candidate.name}

                                </h4>

                                <p className="text-sm text-muted-foreground">

                                    {candidate.position}

                                </p>

                            </div>

                            <span className="font-semibold">

                                {candidate.score}%

                            </span>

                        </div>

                    ))}

                </div>

            </CardContent>

        </Card>

    );

}