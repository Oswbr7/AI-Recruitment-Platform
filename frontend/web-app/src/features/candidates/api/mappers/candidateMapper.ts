import type { Candidate } from "../../models/Candidate";
import type { CandidateResponse } from "../dto/CandidateResponse";

export function toCandidate(response: CandidateResponse): Candidate {

    return {

        id: response.id,

        firstName: response.firstName,

        lastName: response.lastName,

        email: response.email,

        phone: response.phone ?? undefined,

        location: response.location ?? undefined,

        headline: response.headline ?? undefined,

        summary: response.summary ?? undefined,

        linkedInUrl: response.linkedInUrl ?? undefined,

        githubUrl: response.githubUrl ?? undefined,

        portfolioUrl: response.portfolioUrl ?? undefined,

        currentCompany: response.currentCompany ?? undefined,

        currentPosition: response.currentPosition ?? undefined,

        yearsOfExperience: response.yearsOfExperience ?? undefined,

        expectedSalary: response.expectedSalary ?? undefined,

        currency: response.currency ?? undefined,

        stage: response.stage as Candidate["stage"],

        status: response.status as Candidate["status"],

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
