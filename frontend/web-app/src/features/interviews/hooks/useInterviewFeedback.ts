import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/query/queryKeys";
import { interviewFeedbackApi } from "../services/InterviewFeedbackApi";

export function useInterviewFeedback(interviewId: string) {

    return useQuery({

        queryKey: queryKeys.interviews.feedback(interviewId),

        queryFn: () => interviewFeedbackApi.getByInterviewId(interviewId),

        enabled: Boolean(interviewId),

    });

}
