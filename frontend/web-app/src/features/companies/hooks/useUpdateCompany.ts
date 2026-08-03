import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";
import { toUpdateCompanyRequest } from "../api/mappers/companyFormMapper";
import type { CompanyFormValues } from "../schemas/companySchema";

export function useUpdateCompany(id: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: CompanyFormValues) =>
            companyApi.update(id, toUpdateCompanyRequest(values)),

        onSuccess: () => {

            toast.success("Company updated successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.all,
            });

        },

        onError: () => {

            toast.error("Unable to update company.");

        }

    });

}
