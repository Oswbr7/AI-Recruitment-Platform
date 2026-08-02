import { StatusBadge } from "@/shared/StatusBadge";

import { JobStatus, type Job } from "../../models/Job";

const variantByStatus: Record<Job["status"], "success" | "warning" | "info" | "danger"> = {
    [JobStatus.Draft]: "warning",
    [JobStatus.Published]: "success",
    [JobStatus.Closed]: "info",
    [JobStatus.Archived]: "danger",
};

interface Props {

    status: Job["status"];

}

export function JobStatusBadge({
    status,
}: Props) {

    return (

        <StatusBadge variant={variantByStatus[status]}>

            {status}

        </StatusBadge>

    );

}
