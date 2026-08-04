import type { InterviewFeedback } from "../../models/InterviewFeedback";
import type { InterviewFeedbackResponse } from "../dto/InterviewFeedbackResponse";

export function toInterviewFeedback(response: InterviewFeedbackResponse): InterviewFeedback {

    return {

        id: response.id,

        interviewId: response.interviewId,

        reviewerId: response.reviewerId,

        technicalScore: response.technicalScore,

        communicationScore: response.communicationScore,

        problemSolvingScore: response.problemSolvingScore,

        cultureFitScore: response.cultureFitScore,

        comments: response.comments ?? undefined,

        recommendation: response.recommendation as InterviewFeedback["recommendation"],

        createdAt: new Date(response.createdAt),

    };

}
