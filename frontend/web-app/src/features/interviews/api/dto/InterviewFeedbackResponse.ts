export interface InterviewFeedbackResponse {

    id: string;

    interviewId: string;

    reviewerId: string;

    technicalScore: number;

    communicationScore: number;

    problemSolvingScore: number;

    cultureFitScore: number;

    comments: string | null;

    recommendation: string;

    createdAt: string;

}
