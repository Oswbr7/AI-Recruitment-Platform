import { describe, it, expect } from "vitest";

import { scoreCandidate, rankCandidates } from "./scoring";
import type { Candidate } from "@/features/candidates/models/Candidate";
import type { Job } from "@/features/jobs/models/Job";

function jobFixture(overrides: Partial<Job> = {}): Job {
    return {
        id: "job-1",
        title: "Backend Developer",
        description: "We need a backend developer with API experience",
        department: "Engineering",
        location: "Guadalajara",
        status: "Published",
        employmentType: "FullTime",
        experienceLevel: "MidLevel",
        remoteType: "OnSite",
        salaryMin: 3000,
        salaryMax: 5000,
        currency: "USD",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

function candidateFixture(overrides: Partial<Candidate> = {}): Candidate {
    return {
        id: "cand-1",
        firstName: "María",
        lastName: "López",
        email: "maria@example.com",
        location: "Guadalajara, México",
        headline: "Backend developer",
        currentPosition: "Software Engineer",
        summary: "Backend developer with API experience",
        yearsOfExperience: 4,
        expectedSalary: 4000,
        stage: "Applied",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

describe("scoreCandidate", () => {
    it("match fuerte: maxima ubicacion, experiencia, salario, pipeline y keywords", () => {
        const b = scoreCandidate(jobFixture(), candidateFixture());

        expect(b.location).toBe(25);      // misma ciudad
        expect(b.experience).toBe(25);    // 4 años >= 3 requeridos (MidLevel)
        expect(b.salary).toBe(20);        // 4000 dentro de [3000, 5000]
        expect(b.pipeline).toBe(15);      // Applied
        expect(b.keywords).toBe(15);      // "backend", "developer", "api"...
        expect(b.total).toBe(100);
    });

    it("datos ausentes del candidato puntuan neutral, nunca penalizan", () => {
        const b = scoreCandidate(
            jobFixture(),
            candidateFixture({
                location: undefined,
                yearsOfExperience: undefined,
                expectedSalary: undefined,
                headline: undefined,
                currentPosition: undefined,
                summary: undefined,
            }));

        expect(b.experience).toBe(10);
        expect(b.salary).toBe(10);
        expect(b.keywords).toBe(0);
    });

    it("ubicacion distinta en vacante presencial puntua bajo", () => {
        const b = scoreCandidate(
            jobFixture({ remoteType: "OnSite" }),
            candidateFixture({ location: "Buenos Aires, Argentina" }));

        expect(b.location).toBe(5);
    });

    it("vacante remota acepta cualquier ubicacion", () => {
        const withLocation = scoreCandidate(
            jobFixture({ remoteType: "Remote" }),
            candidateFixture());
        const withoutLocation = scoreCandidate(
            jobFixture({ remoteType: "Remote" }),
            candidateFixture({ location: undefined }));

        expect(withLocation.location).toBe(20);
        expect(withoutLocation.location).toBe(15);
    });

    it("experiencia por debajo del requerido puntua bajo", () => {
        const b = scoreCandidate(
            jobFixture({ experienceLevel: "Senior" }), // requiere 5
            candidateFixture({ yearsOfExperience: 1 }));

        expect(b.experience).toBe(5);
    });

    it("expectativa salarial arriba del techo puntua bajo", () => {
        const b = scoreCandidate(
            jobFixture(),
            candidateFixture({ expectedSalary: 9000 }));

        expect(b.salary).toBe(5);
    });

    it("candidato avanzado en el pipeline puntua menos que uno recien aplicado", () => {
        const late = scoreCandidate(
            jobFixture(),
            candidateFixture({ stage: "HRInterview" }));

        expect(late.pipeline).toBe(5);
    });
});

describe("rankCandidates", () => {
    it("ordena de mayor a menor score", () => {
        const strong = candidateFixture({ id: "strong" });
        const weak = candidateFixture({
            id: "weak",
            location: "Buenos Aires, Argentina",
            yearsOfExperience: 0,
            expectedSalary: 9000,
            stage: "HRInterview",
        });

        const ranked = rankCandidates(jobFixture(), [weak, strong]);

        expect(ranked.map((m) => m.candidate.id)).toEqual(["strong", "weak"]);
        expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    });

    it("lista vacia devuelve lista vacia", () => {
        expect(rankCandidates(jobFixture(), [])).toEqual([]);
    });
});
