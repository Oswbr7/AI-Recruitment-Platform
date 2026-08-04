import { interviewsApi } from "@/shared/api/interviewApiClient";
import type { ApiResponse } from "@/shared/api/types";

import { toInterviewFeedback } from "../api/mappers/interviewFeedbackMapper";
import type { InterviewFeedbackResponse } from "../api/dto/InterviewFeedbackResponse";
import type { InterviewFeedback } from "../models/InterviewFeedback";
import type { SubmitInterviewFeedbackRequest } from "../types/SubmitInterviewFeedbackRequest";

export const interviewFeedbackApi = {

    async getByInterviewId(interviewId: string): Promise<InterviewFeedback[]> {

        const response = await interviewsApi.get<ApiResponse<InterviewFeedbackResponse[]>>(
            `/interviews/${interviewId}/feedback`
        );

        return response.data.data.map(toInterviewFeedback);

    },

    async submit(interviewId: string, request: SubmitInterviewFeedbackRequest): Promise<InterviewFeedback> {

        const response = await interviewsApi.post<ApiResponse<InterviewFeedbackResponse>>(
            `/interviews/${interviewId}/feedback`,
            request
        );

        return toInterviewFeedback(response.data.data);

    },

};
