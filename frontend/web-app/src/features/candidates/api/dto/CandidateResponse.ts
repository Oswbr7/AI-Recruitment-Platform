export interface CandidateResponse {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    phone: string | null;

    location: string | null;

    headline: string | null;

    summary: string | null;

    linkedInUrl: string | null;

    githubUrl: string | null;

    portfolioUrl: string | null;

    currentCompany: string | null;

    currentPosition: string | null;

    yearsOfExperience: number | null;

    expectedSalary: number | null;

    currency: string | null;

    stage: string;

    status: string;

    createdAt: string;

    updatedAt: string;

}
