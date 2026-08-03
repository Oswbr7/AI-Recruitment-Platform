import { StatusBadge } from "@/shared/StatusBadge";

import { CandidateStage, type Candidate } from "../../models/Candidate";

const variantByStage: Record<Candidate["stage"], "success" | "warning" | "info" | "danger"> = {
    [CandidateStage.Applied]: "info",
    [CandidateStage.Screening]: "warning",
    [CandidateStage.TechnicalInterview]: "warning",
    [CandidateStage.HRInterview]: "warning",
    [CandidateStage.Offer]: "success",
    [CandidateStage.Hired]: "success",
    [CandidateStage.Rejected]: "danger",
};

interface Props {

    stage: Candidate["stage"];

}

export function CandidateStageBadge({
    stage,
}: Props) {

    return (

        <StatusBadge variant={variantByStage[stage]}>

            {stage}

        </StatusBadge>

    );

}
