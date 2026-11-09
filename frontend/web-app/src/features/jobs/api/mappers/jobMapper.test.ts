import { describe, it, expect } from "vitest";

import { toJob } from "./jobMapper";
import type { JobResponse } from "../dto/JobResponse";

function fixture(overrides: Partial<JobResponse> = {}): JobResponse {
    return {
        id: "job-1",
        title: "Backend Developer",
        description: "Descripcion",
        department: "Engineering",
        location: "Remoto",
        employmentType: "FullTime",
        experienceLevel: "Mid",
        remoteType: "Remote",
        salaryMin: 3000,
        salaryMax: 5000,
        currency: "USD",
        companyId: "company-1",
        status: "Open",
        publishedAt: "2026-01-01T00:00:00.000Z",
        closedAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        ...overrides,
    };
}

describe("toJob", () => {
    it("mapea los campos directos y convierte fechas a Date", () => {
        const job = toJob(fixture());

        expect(job.id).toBe("job-1");
        expect(job.title).toBe("Backend Developer");
        expect(job.status).toBe("Open");
        expect(job.publishedAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
        expect(job.createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
        expect(job.updatedAt).toEqual(new Date("2026-02-01T00:00:00.000Z"));
    });

    it("null del DTO -> undefined del modelo (salarios, moneda, empresa)", () => {
        const job = toJob(fixture({
            salaryMin: null,
            salaryMax: null,
            currency: null,
            companyId: null,
        }));

        expect(job.salaryMin).toBeUndefined();
        expect(job.salaryMax).toBeUndefined();
        expect(job.currency).toBeUndefined();
        expect(job.companyId).toBeUndefined();
    });

    it("fechas null -> undefined (publishedAt/closedAt opcionales)", () => {
        const job = toJob(fixture({ publishedAt: null, closedAt: null }));

        expect(job.publishedAt).toBeUndefined();
        expect(job.closedAt).toBeUndefined();
    });
});
