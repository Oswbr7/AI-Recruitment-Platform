import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";
import { toScheduleInterviewRequest } from "../api/mappers/interviewFormMapper";
import type { InterviewFormValues } from "../schemas/interviewSchema";

export function useScheduleInterview() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (values: InterviewFormValues) =>
            interviewApi.schedule(toScheduleInterviewRequest(values)),

        onSuccess: () => {

            toast.success("Interview scheduled successfully.");

            queryClient.invalidateQueries({

                queryKey: queryKeys.interviews.all,

            });

        },

        onError: () => {

            toast.error("Unable to schedule interview.");

        }

    });

}
