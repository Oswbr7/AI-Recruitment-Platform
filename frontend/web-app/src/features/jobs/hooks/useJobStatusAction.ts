import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import type { Job } from "../models/Job";

export function useJobStatusAction(
    action: (id: string) => Promise<Job>,
    successMessage: string,
    errorMessage: string,
) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => action(id),

        onSuccess: () => {

            toast.success(successMessage);

            queryClient.invalidateQueries({
                queryKey: queryKeys.jobs.all,
            });

        },

        onError: () => {

            toast.error(errorMessage);

        }

    });

}
