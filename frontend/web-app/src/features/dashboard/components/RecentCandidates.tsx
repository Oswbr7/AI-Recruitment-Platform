import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import type { Candidate } from "@/features/candidates/models/Candidate";

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

                {candidates.length === 0 ? (

                    <EmptyState
                        title="No candidates yet"
                        description="New candidates will appear here."
                    />

                ) : (

                    <div className="space-y-4">

                        {candidates.map(candidate => (

                            <div
                                key={candidate.id}
                                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                            >

                                <div>

                                    <h4 className="font-medium">

                                        {candidate.firstName} {candidate.lastName}

                                    </h4>

                                    <p className="text-sm text-muted-foreground">

                                        {candidate.currentPosition ?? candidate.headline ?? "—"}

                                    </p>

                                </div>

                                <span className="text-sm text-muted-foreground">

                                    {candidate.stage}

                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}
