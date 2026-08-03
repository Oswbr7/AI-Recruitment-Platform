import { StatusBadge } from "@/shared/StatusBadge";

import { CandidateStatus, type Candidate } from "../../models/Candidate";

const variantByStatus: Record<Candidate["status"], "success" | "warning" | "info" | "danger"> = {
    [CandidateStatus.Active]: "success",
    [CandidateStatus.Archived]: "danger",
};

interface Props {

    status: Candidate["status"];

}

export function CandidateStatusBadge({
    status,
}: Props) {

    return (

        <StatusBadge variant={variantByStatus[status]}>

            {status}

        </StatusBadge>

    );

}
