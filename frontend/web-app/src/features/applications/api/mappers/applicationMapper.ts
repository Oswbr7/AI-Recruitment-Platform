import type { ApplicationResponseDto } from "../dto/ApplicationResponseDto";
import type { Application } from "../../types/Application";

export function toApplication(dto: ApplicationResponseDto): Application {
    return {
        id: dto.id,
        candidateId: dto.candidateId,
        jobId: dto.jobId,
        status: dto.status as Application["status"],
        source: dto.source as Application["source"],
        coverNote: dto.coverNote ?? undefined,
        appliedAt: new Date(dto.appliedAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
