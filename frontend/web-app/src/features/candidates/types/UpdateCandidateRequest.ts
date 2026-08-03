export interface UpdateCandidateRequest {

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

}
