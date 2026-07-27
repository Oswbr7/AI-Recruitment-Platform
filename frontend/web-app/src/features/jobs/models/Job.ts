export enum JobStatus {
    Draft = "Draft",
    Published = "Published",
    Closed = "Closed",
}

export enum EmploymentType {
    FullTime = "FullTime",
    PartTime = "PartTime",
    Contract = "Contract",
    Internship = "Internship",
}

export enum ExperienceLevel {
    Junior = "Junior",
    Mid = "Mid",
    Senior = "Senior",
    Lead = "Lead",
}

export enum RemoteType {
    OnSite = "OnSite",
    Hybrid = "Hybrid",
    Remote = "Remote",
}

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

    createdAt: Date;

    updatedAt: Date;
}