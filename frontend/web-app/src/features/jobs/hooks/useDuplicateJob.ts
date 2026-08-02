import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";

export function useDuplicateJob() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => jobApi.duplicate(id),

        onSuccess: () => {

            toast.success("Job duplicated.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.jobs.all,
            });

        },

        onError: () => {

            toast.error("Unable to duplicate job.");

        }

    });

}
