import { StatusBadge } from "@/shared/StatusBadge";

import { InterviewStatus, type Interview } from "../../models/Interview";

const variantByStatus: Record<Interview["status"], "success" | "warning" | "info" | "danger"> = {
    [InterviewStatus.Scheduled]: "info",
    [InterviewStatus.Completed]: "success",
    [InterviewStatus.Cancelled]: "danger",
    [InterviewStatus.NoShow]: "warning",
};

interface Props {

    status: Interview["status"];

}

export function InterviewStatusBadge({
    status,
}: Props) {

    return (

        <StatusBadge variant={variantByStatus[status]}>

            {status}

        </StatusBadge>

    );

}
