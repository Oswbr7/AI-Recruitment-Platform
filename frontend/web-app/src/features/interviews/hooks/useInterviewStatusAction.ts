import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import type { Interview } from "../models/Interview";

export function useInterviewStatusAction(
    action: (id: string) => Promise<Interview>,
    successMessage: string,
    errorMessage: string,
) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => action(id),

        onSuccess: () => {

            toast.success(successMessage);

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.all,
            });

        },

        onError: () => {

            toast.error(errorMessage);

        }

    });

}
