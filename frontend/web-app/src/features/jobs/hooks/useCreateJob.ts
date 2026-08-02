import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { jobApi } from "../services/JobApi";
import { toCreateJobRequest } from "../api/mappers/jobFormMapper";
import type { JobFormValues } from "../schemas/jobSchema";

export function useCreateJob() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: JobFormValues) =>
            jobApi.create(toCreateJobRequest(values)),

        onSuccess: () => {

            toast.success("Job created successfully.");

            queryClient.invalidateQueries({

                queryKey: queryKeys.jobs.all,

            });

        },

        onError: () => {

            toast.error("Unable to create job.");

        }

    });

}
