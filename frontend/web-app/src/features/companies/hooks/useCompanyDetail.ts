import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";

export function useCompanyDetail(id: string) {

    return useQuery({

        queryKey: queryKeys.companies.detail(id),

        queryFn: () => companyApi.getById(id),

        enabled: Boolean(id),

    });

}
