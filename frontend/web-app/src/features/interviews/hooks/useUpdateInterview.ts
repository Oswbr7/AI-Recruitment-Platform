import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";
import { toUpdateInterviewRequest } from "../api/mappers/interviewFormMapper";
import type { InterviewFormValues } from "../schemas/interviewSchema";

export function useUpdateInterview(id: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: InterviewFormValues) =>
            interviewApi.update(id, toUpdateInterviewRequest(values)),

        onSuccess: () => {

            toast.success("Interview updated successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.all,
            });

        },

        onError: () => {

            toast.error("Unable to update interview.");

        }

    });

}
