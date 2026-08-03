import { companyApi } from "../services/CompanyApi";
import { useCompanyStatusAction } from "./useCompanyStatusAction";

export function useRestoreCompany() {

    return useCompanyStatusAction(
        companyApi.restore,
        "Company restored.",
        "Unable to restore company."
    );

}
