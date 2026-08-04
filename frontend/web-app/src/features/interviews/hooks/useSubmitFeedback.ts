import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewFeedbackApi } from "../services/InterviewFeedbackApi";
import type { SubmitInterviewFeedbackRequest } from "../types/SubmitInterviewFeedbackRequest";

export function useSubmitFeedback(interviewId: string) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (request: SubmitInterviewFeedbackRequest) =>
            interviewFeedbackApi.submit(interviewId, request),

        onSuccess: () => {

            toast.success("Feedback submitted.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.feedback(interviewId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.interviews.detail(interviewId),
            });

        },

        onError: () => {

            toast.error("Unable to submit feedback.");

        }

    });

}
