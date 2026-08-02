export const JobStatus = {
    Draft: "Draft",
    Published: "Published",
    Closed: "Closed",
    Archived: "Archived",
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export const EmploymentType = {
    FullTime: "FullTime",
    PartTime: "PartTime",
    Contract: "Contract",
    Internship: "Internship",
    Temporary: "Temporary",
} as const;

export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];

export const ExperienceLevel = {
    EntryLevel: "EntryLevel",
    Junior: "Junior",
    MidLevel: "MidLevel",
    Senior: "Senior",
    Lead: "Lead",
    Executive: "Executive",
} as const;

export type ExperienceLevel = typeof ExperienceLevel[keyof typeof ExperienceLevel];

export const RemoteType = {
    OnSite: "OnSite",
    Remote: "Remote",
    Hybrid: "Hybrid",
} as const;

export type RemoteType = typeof RemoteType[keyof typeof RemoteType];

export interface Job {

    id: string;

    title: string;

    description: string;

    department: string;

    location: string;

    status: JobStatus;

    employmentType?: EmploymentType;

    experienceLevel?: ExperienceLevel;

    remoteType?: RemoteType;

    salaryMin?: number;

    salaryMax?: number;

    currency?: string;

    publishedAt?: Date;

    closedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}
