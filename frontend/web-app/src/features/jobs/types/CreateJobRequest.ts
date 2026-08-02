export interface CreateJobRequest {

    title: string;

    description: string;

    department: string;

    location: string;

    employmentType: string;

    experienceLevel: string;

    remoteType: string;

    salaryMin?: number;

    salaryMax?: number;

    currency?: string;

}
