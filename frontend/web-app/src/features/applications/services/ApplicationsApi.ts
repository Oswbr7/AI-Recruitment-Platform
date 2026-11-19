import { candidatesApi } from "@/shared/api/candidatesApiClient";
import type { ApiResponse, PagedResult } from "@/shared/api/types";

import type { ApplicationResponseDto } from "../api/dto/ApplicationResponseDto";
import { toApplication } from "../api/mappers/applicationMapper";
import type { Application } from "../types/Application";

export interface GetApplicationsParams {
    page?: number;

    pageSize?: number;

    candidateId?: string;

    jobId?: string;

    status?: string;

    sortBy?: string;

    sortDirection?: string;
}

export type ApplicationTransition =
    "start-review" | "to-interviewing" | "offer" | "reject" | "withdraw";

export const applicationsApi = {
    async getPaged(params: GetApplicationsParams): Promise<PagedResult<Application>> {
        const response = await candidatesApi.get<ApiResponse<PagedResult<ApplicationResponseDto>>>(
            "/applications",
            { params },
        );

        return {
            ...response.data.data,
            items: response.data.data.items.map(toApplication),
        };
    },

    // Solo las MIS aplicaciones (resolucion sub -> candidato en el backend).
    // Devuelve PagedResult para mantener la forma del hook.
    async getMine(params: { page?: number; pageSize?: number }): Promise<PagedResult<Application>> {
        const response = await candidatesApi.get<ApiResponse<PagedResult<ApplicationResponseDto>>>(
            "/applications/mine",
            { params },
        );

        return {
            ...response.data.data,
            items: response.data.data.items.map(toApplication),
        };
    },

    async submit(request: {
        candidateId: string;
        jobId: string;
        source?: string;
        coverNote?: string;
    }): Promise<void> {
        await candidatesApi.post("/applications", request);
    },

    async transition(id: string, transition: ApplicationTransition): Promise<void> {
        await candidatesApi.post(`/applications/${id}/${transition}`);
    },
};
