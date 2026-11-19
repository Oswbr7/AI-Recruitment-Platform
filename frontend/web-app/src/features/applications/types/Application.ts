export const ApplicationStatus = {
    Applied: "Applied",
    Reviewing: "Reviewing",
    Interviewing: "Interviewing",
    Offered: "Offered",
    Rejected: "Rejected",
    Withdrawn: "Withdrawn",
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ApplicationSource = {
    Manual: "Manual",
    Portal: "Portal",
    Referral: "Referral",
} as const;

export type ApplicationSource = (typeof ApplicationSource)[keyof typeof ApplicationSource];

export interface Application {
    id: string;

    candidateId: string;

    jobId: string;

    status: ApplicationStatus;

    source?: ApplicationSource;

    coverNote?: string;

    appliedAt: Date;

    updatedAt: Date;
}
