export const CandidateStage = {
    Applied: "Applied",
    Screening: "Screening",
    TechnicalInterview: "TechnicalInterview",
    HRInterview: "HRInterview",
    Offer: "Offer",
    Hired: "Hired",
    Rejected: "Rejected",
} as const;

export type CandidateStage = typeof CandidateStage[keyof typeof CandidateStage];

export const CandidateStatus = {
    Active: "Active",
    Archived: "Archived",
} as const;

export type CandidateStatus = typeof CandidateStatus[keyof typeof CandidateStatus];

export interface Candidate {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    phone?: string;

    location?: string;

    headline?: string;

    summary?: string;

    linkedInUrl?: string;

    githubUrl?: string;

    portfolioUrl?: string;

    currentCompany?: string;

    currentPosition?: string;

    yearsOfExperience?: number;

    expectedSalary?: number;

    currency?: string;

    stage: CandidateStage;

    status: CandidateStatus;

    createdAt: Date;

    updatedAt: Date;
}
