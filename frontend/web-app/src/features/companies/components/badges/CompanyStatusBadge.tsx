import { StatusBadge } from "@/shared/StatusBadge";

import { CompanyStatus, type Company } from "../../models/Company";

const variantByStatus: Record<Company["status"], "success" | "warning" | "info" | "danger"> = {
    [CompanyStatus.Active]: "success",
    [CompanyStatus.Archived]: "danger",
};

interface Props {

    status: Company["status"];

}

export function CompanyStatusBadge({
    status,
}: Props) {

    return (

        <StatusBadge variant={variantByStatus[status]}>

            {status}

        </StatusBadge>

    );

}
