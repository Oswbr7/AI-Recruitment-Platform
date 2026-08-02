import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";

export function useDeleteJob() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: string) => jobApi.remove(id),

        onSuccess: () => {

            toast.success("Job deleted successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.jobs.all,
            });

        },

        onError: () => {

            toast.error("Unable to delete job.");

        }

    });

}
