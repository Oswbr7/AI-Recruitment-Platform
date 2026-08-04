export const InterviewStatus = {
    Scheduled: "Scheduled",
    Completed: "Completed",
    Cancelled: "Cancelled",
    NoShow: "NoShow",
} as const;

export type InterviewStatus = typeof InterviewStatus[keyof typeof InterviewStatus];

export const InterviewType = {
    Phone: "Phone",
    Video: "Video",
    OnSite: "OnSite",
    Technical: "Technical",
    HR: "HR",
    Panel: "Panel",
} as const;

export type InterviewType = typeof InterviewType[keyof typeof InterviewType];

export const InterviewStage = {
    Screening: "Screening",
    Technical: "Technical",
    HR: "HR",
    Final: "Final",
} as const;

export type InterviewStage = typeof InterviewStage[keyof typeof InterviewStage];

export interface Interview {

    id: string;

    candidateId: string;

    jobId: string;

    recruiterId: string;

    title: string;

    description?: string;

    interviewType: InterviewType;

    interviewStage: InterviewStage;

    scheduledAt: Date;

    durationMinutes: number;

    meetingUrl?: string;

    location?: string;

    status: InterviewStatus;

    feedbackSubmitted: boolean;

    overallScore?: number;

    createdAt: Date;

    updatedAt: Date;
}
