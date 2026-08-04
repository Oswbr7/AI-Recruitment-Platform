export interface UpdateInterviewRequest {

    title: string;

    description?: string;

    interviewType: string;

    interviewStage: string;

    durationMinutes: number;

    meetingUrl?: string;

    location?: string;

}
