import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { companyApi } from "../services/CompanyApi";

export function useUpdateCompanyLogo(id: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (logoUrl: string | undefined) =>
            companyApi.updateLogo(id, logoUrl),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.all,
            });

        },

        onError: () => {

            toast.error("Unable to update logo.");

        }

    });

}
