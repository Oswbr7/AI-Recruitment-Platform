import { useState } from "react";

import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";
import { LoadingSpinner } from "@/shared/components/loading/LoadingSpinner";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useJobMatches } from "../hooks/useJobMatches";
import type { CandidateMatch } from "../scoring";

function scoreBadgeClass(score: number): string {
    if (score >= 75)
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    if (score >= 50) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    return "bg-muted text-muted-foreground";
}

function MatchRow({ rank, match }: { rank: number; match: CandidateMatch }) {
    const { candidate, score, breakdown } = match;

    return (
        <TableRow>
            <TableCell className="font-medium">#{rank}</TableCell>

            <TableCell>
                <div className="font-medium">
                    {candidate.firstName} {candidate.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{candidate.email}</div>
            </TableCell>

            <TableCell className="max-w-56 truncate text-muted-foreground">
                {candidate.headline ?? candidate.currentPosition ?? "—"}
            </TableCell>

            <TableCell>
                <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreBadgeClass(score)}`}
                >
                    {score}
                </span>
            </TableCell>

            <TableCell className="text-sm text-muted-foreground">
                <div>Location {breakdown.location}/25</div>
                <div>Experience {breakdown.experience}/25</div>
                <div>Salary {breakdown.salary}/20</div>
                <div>Pipeline {breakdown.pipeline}/15</div>
                <div>Keywords {breakdown.keywords}/15</div>
            </TableCell>

            <TableCell className="text-sm">
                {candidate.yearsOfExperience != null ? `${candidate.yearsOfExperience} yrs` : "—"}
            </TableCell>

            <TableCell className="text-sm">
                {candidate.expectedSalary != null
                    ? `${candidate.currency ?? ""} ${candidate.expectedSalary}`.trim()
                    : "—"}
            </TableCell>
        </TableRow>
    );
}

export function MatchingPage() {
    const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
    const { jobsQuery, jobQuery, candidatesQuery, jobId, matches } = useJobMatches(selectedJobId);

    const isLoading = jobsQuery.isLoading || jobQuery.isLoading || candidatesQuery.isLoading;

    return (
        <PageContainer>
            <PageHeader
                title="AI Matching"
                description="Deterministic candidate-vs-job scoring: location, experience, salary, pipeline stage and keyword overlap."
            />

            <div className="mb-6 flex items-center gap-4">
                <label htmlFor="job-select" className="text-sm font-medium">
                    Job
                </label>

                <select
                    id="job-select"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={jobId ?? ""}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                >
                    {(jobsQuery.data ?? []).map((job) => (
                        <option key={job.id} value={job.id}>
                            {job.title} — {job.location}
                        </option>
                    ))}
                </select>

                {candidatesQuery.data && (
                    <span className="text-sm text-muted-foreground">
                        {matches.length} candidates ranked
                    </span>
                )}
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : matches.length === 0 ? (
                <EmptyState
                    title="No candidates to rank"
                    description="Add candidates or pick a job with requirements to see matches."
                />
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Headline</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Breakdown</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Expected salary</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {matches.map((match, index) => (
                                <MatchRow key={match.candidate.id} rank={index + 1} match={match} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </PageContainer>
    );
}
