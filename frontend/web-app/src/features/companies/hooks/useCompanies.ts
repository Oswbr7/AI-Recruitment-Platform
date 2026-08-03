import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";
import type { GetCompaniesParams } from "../types/GetCompaniesParams";

export function useCompanies(params: GetCompaniesParams) {

    return useQuery({

        queryKey: queryKeys.companies.list(params),

        queryFn: () => companyApi.getPaged(params),

        placeholderData: keepPreviousData,

    });

}
