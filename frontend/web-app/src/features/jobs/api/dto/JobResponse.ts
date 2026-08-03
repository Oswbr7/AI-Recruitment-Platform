export interface JobResponse {

    id: string;

    title: string;

    description: string;

    department: string;

    location: string;

    employmentType: string;

    experienceLevel: string;

    remoteType: string;

    salaryMin: number | null;

    salaryMax: number | null;

    currency: string | null;

    companyId: string | null;

    status: string;

    publishedAt: string | null;

    closedAt: string | null;

    createdAt: string;

    updatedAt: string;

}
