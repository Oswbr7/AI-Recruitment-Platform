import { StatusBadge } from "@/shared/StatusBadge";

import { InterviewStage, type Interview } from "../../models/Interview";

const variantByStage: Record<Interview["interviewStage"], "success" | "warning" | "info" | "danger"> = {
    [InterviewStage.Screening]: "info",
    [InterviewStage.Technical]: "warning",
    [InterviewStage.HR]: "warning",
    [InterviewStage.Final]: "success",
};

interface Props {

    stage: Interview["interviewStage"];

}

export function InterviewStageBadge({
    stage,
}: Props) {

    return (

        <StatusBadge variant={variantByStage[stage]}>

            {stage}

        </StatusBadge>

    );

}
