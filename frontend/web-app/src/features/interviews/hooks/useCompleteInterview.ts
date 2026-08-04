import { interviewApi } from "../services/InterviewApi";
import { useInterviewStatusAction } from "./useInterviewStatusAction";

export function useCompleteInterview() {

    return useInterviewStatusAction(
        interviewApi.complete,
        "Interview completed.",
        "Unable to complete interview."
    );

}
