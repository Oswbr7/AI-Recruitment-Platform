export interface InterviewResponse {

    id: string;

    candidateId: string;

    jobId: string;

    recruiterId: string;

    title: string;

    description: string | null;

    interviewType: string;

    interviewStage: string;

    scheduledAt: string;

    durationMinutes: number;

    meetingUrl: string | null;

    location: string | null;

    status: string;

    feedbackSubmitted: boolean;

    overallScore: number | null;

    createdAt: string;

    updatedAt: string;

}
