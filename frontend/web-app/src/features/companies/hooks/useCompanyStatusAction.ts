import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import type { Company } from "../models/Company";

export function useCompanyStatusAction(
    action: (id: string) => Promise<Company>,
    successMessage: string,
    errorMessage: string,
) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => action(id),

        onSuccess: () => {

            toast.success(successMessage);

            queryClient.invalidateQueries({
                queryKey: queryKeys.companies.all,
            });

        },

        onError: () => {

            toast.error(errorMessage);

        }

    });

}
