export interface ScheduleInterviewRequest {

    candidateId: string;

    jobId: string;

    recruiterId: string;

    title: string;

    description?: string;

    interviewType: string;

    interviewStage: string;

    scheduledAt: string;

    durationMinutes: number;

    meetingUrl?: string;

    location?: string;

}
