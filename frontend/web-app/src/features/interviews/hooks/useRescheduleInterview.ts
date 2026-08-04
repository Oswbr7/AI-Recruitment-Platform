import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewApi } from "../services/InterviewApi";

interface RescheduleInterviewVariables {

    id: string;

    scheduledAt: string;

}

export function useRescheduleInterview() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ id, scheduledAt }: RescheduleInterviewVariables) =>
            interviewApi.reschedule(id, { scheduledAt }),

        onSuccess: () => {

            toast.success("Interview rescheduled successfully.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.all,
            });

        },

        onError: () => {

            toast.error("Unable to reschedule interview.");

        }

    });

}
