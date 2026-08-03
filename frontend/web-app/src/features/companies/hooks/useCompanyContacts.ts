import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyContactApi } from "../services/CompanyContactApi";

export function useCompanyContacts(companyId: string) {

    return useQuery({

        queryKey: queryKeys.companies.contacts(companyId),

        queryFn: () => companyContactApi.getByCompanyId(companyId),

        enabled: Boolean(companyId),

    });

}
