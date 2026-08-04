export interface SubmitInterviewFeedbackRequest {

    reviewerId: string;

    technicalScore: number;

    communicationScore: number;

    problemSolvingScore: number;

    cultureFitScore: number;

    comments?: string;

    recommendation: string;

}
