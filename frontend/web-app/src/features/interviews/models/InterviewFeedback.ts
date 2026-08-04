export const Recommendation = {
    StrongHire: "StrongHire",
    Hire: "Hire",
    Neutral: "Neutral",
    NoHire: "NoHire",
    StrongNoHire: "StrongNoHire",
} as const;

export type Recommendation = typeof Recommendation[keyof typeof Recommendation];

export interface InterviewFeedback {

    id: string;

    interviewId: string;

    reviewerId: string;

    technicalScore: number;

    communicationScore: number;

    problemSolvingScore: number;

    cultureFitScore: number;

    comments?: string;

    recommendation: Recommendation;

    createdAt: Date;
}
