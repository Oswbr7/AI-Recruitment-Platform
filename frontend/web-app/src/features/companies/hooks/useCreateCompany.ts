import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";
import { toCreateCompanyRequest } from "../api/mappers/companyFormMapper";
import type { CompanyFormValues } from "../schemas/companySchema";

export function useCreateCompany() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: CompanyFormValues) =>
            companyApi.create(toCreateCompanyRequest(values)),

        onSuccess: () => {

            toast.success("Company created successfully.");

            queryClient.invalidateQueries({

                queryKey: queryKeys.companies.all,

            });

        },

        onError: () => {

            toast.error("Unable to create company.");

        }

    });

}
