import { interviewApi } from "../services/InterviewApi";
import { useInterviewStatusAction } from "./useInterviewStatusAction";

export function useCancelInterview() {

    return useInterviewStatusAction(
        interviewApi.cancel,
        "Interview cancelled.",
        "Unable to cancel interview."
    );

}
