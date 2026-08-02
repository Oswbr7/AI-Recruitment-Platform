import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";
import { toUpdateJobRequest } from "../api/mappers/jobFormMapper";
import type { JobFormValues } from "../schemas/jobSchema";

export function useUpdateJob(id: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: JobFormValues) =>
            jobApi.update(id, toUpdateJobRequest(values)),

        onSuccess: () => {

            toast.success("Job updated successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.jobs.all,
            });

        },

        onError: () => {

            toast.error("Unable to update job.");

        }

    });

}
