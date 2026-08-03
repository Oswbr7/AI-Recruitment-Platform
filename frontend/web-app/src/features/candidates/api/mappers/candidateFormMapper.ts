import type { CandidateFormValues } from "../../schemas/candidateSchema";
import type { CreateCandidateRequest } from "../../types/CreateCandidateRequest";
import type { UpdateCandidateRequest } from "../../types/UpdateCandidateRequest";
import type { Candidate } from "../../models/Candidate";

export function toCreateCandidateRequest(values: CandidateFormValues): CreateCandidateRequest {

    return {

        firstName: values.firstName,

        lastName: values.lastName,

        email: values.email,

        phone: values.phone || undefined,

        location: values.location || undefined,

        headline: values.headline || undefined,

        summary: values.summary || undefined,

        linkedInUrl: values.linkedInUrl || undefined,

        githubUrl: values.githubUrl || undefined,

        portfolioUrl: values.portfolioUrl || undefined,

        currentCompany: values.currentCompany || undefined,

        currentPosition: values.currentPosition || undefined,

        yearsOfExperience: values.yearsOfExperience,

        expectedSalary: values.expectedSalary,

        currency: values.currency || undefined,

    };

}

export function toUpdateCandidateRequest(values: CandidateFormValues): UpdateCandidateRequest {

    return toCreateCandidateRequest(values);

}

export function toCandidateFormValues(candidate: Candidate): CandidateFormValues {

    return {

        firstName: candidate.firstName,

        lastName: candidate.lastName,

        email: candidate.email,

        phone: candidate.phone ?? "",

        location: candidate.location ?? "",

        headline: candidate.headline ?? "",

        summary: candidate.summary ?? "",

        linkedInUrl: candidate.linkedInUrl ?? "",

        githubUrl: candidate.githubUrl ?? "",

        portfolioUrl: candidate.portfolioUrl ?? "",

        currentCompany: candidate.currentCompany ?? "",

        currentPosition: candidate.currentPosition ?? "",

        yearsOfExperience: candidate.yearsOfExperience,

        expectedSalary: candidate.expectedSalary,

        currency: candidate.currency ?? "",

    };

}
