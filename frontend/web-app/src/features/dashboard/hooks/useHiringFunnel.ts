import { useMemo } from "react";

import { CandidateStage } from "@/features/candidates/models/Candidate";

import { useDashboardSourceData } from "./internal/useDashboardSourceData";

const FUNNEL_STAGES: { stage: CandidateStage; label: string }[] = [
    { stage: CandidateStage.Applied, label: "Applied" },
    { stage: CandidateStage.Screening, label: "Screening" },
    { stage: CandidateStage.TechnicalInterview, label: "Technical Interview" },
    { stage: CandidateStage.HRInterview, label: "HR Interview" },
    { stage: CandidateStage.Offer, label: "Offer" },
    { stage: CandidateStage.Hired, label: "Hired" },
    { stage: CandidateStage.Rejected, label: "Rejected" },
];

export function useHiringFunnel() {

    const { candidates, isLoading } = useDashboardSourceData();

    const stages = useMemo(() => {

        const total = candidates.length;

        return FUNNEL_STAGES.map(({ stage, label }) => {

            const count = candidates.filter(candidate => candidate.stage === stage).length;

            return {

                stage: label,

                count,

                percentage: total ? Math.round((count / total) * 1000) / 10 : 0,

            };

        });

    }, [candidates]);

    return { stages, isLoading };

}
