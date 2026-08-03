import { companyApi } from "../services/CompanyApi";
import { useCompanyStatusAction } from "./useCompanyStatusAction";

export function useArchiveCompany() {

    return useCompanyStatusAction(
        companyApi.archive,
        "Company archived.",
        "Unable to archive company."
    );

}
