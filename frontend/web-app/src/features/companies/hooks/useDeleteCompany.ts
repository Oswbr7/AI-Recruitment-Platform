import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";

export function useDeleteCompany() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => companyApi.remove(id),

        onSuccess: () => {

            toast.success("Company deleted successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.all,
            });

        },

        onError: () => {

            toast.error("Unable to delete company.");

        }

    });

}
