import { candidatesApi } from "@/shared/api/candidatesApiClient";
import type { ApiResponse, PagedResult } from "@/shared/api/types";

import { toCandidate } from "../api/mappers/candidateMapper";
import type { CandidateResponse } from "../api/dto/CandidateResponse";
import type { Candidate } from "../models/Candidate";
import type { CreateCandidateRequest } from "../types/CreateCandidateRequest";
import type { CreateCandidateResponse } from "../types/CreateCandidateResponse";
import type { UpdateCandidateRequest } from "../types/UpdateCandidateRequest";
import type { GetCandidatesParams } from "../types/GetCandidatesParams";
import type { MoveCandidateStageRequest } from "../types/MoveCandidateStageRequest";

export const candidateApi = {

    async create(request: CreateCandidateRequest): Promise<CreateCandidateResponse> {

        const response = await candidatesApi.post<ApiResponse<CreateCandidateResponse>>(
            "/candidates",
            request
        );

        return response.data.data;

    },

    async getPaged(params: GetCandidatesParams): Promise<PagedResult<Candidate>> {

        const response = await candidatesApi.get<ApiResponse<PagedResult<CandidateResponse>>>(
            "/candidates",
            { params }
        );

        return {

            ...response.data.data,

            items: response.data.data.items.map(toCandidate),

        };

    },

    async getById(id: string): Promise<Candidate> {

        const response = await candidatesApi.get<ApiResponse<CandidateResponse>>(
            `/candidates/${id}`
        );

        return toCandidate(response.data.data);

    },

    async update(id: string, request: UpdateCandidateRequest): Promise<Candidate> {

        const response = await candidatesApi.put<ApiResponse<CandidateResponse>>(
            `/candidates/${id}`,
            request
        );

        return toCandidate(response.data.data);

    },

    async remove(id: string): Promise<void> {

        await candidatesApi.delete(`/candidates/${id}`);

    },

    async moveStage(id: string, stage: string): Promise<Candidate> {

        const request: MoveCandidateStageRequest = { stage };

        const response = await candidatesApi.post<ApiResponse<CandidateResponse>>(
            `/candidates/${id}/move`,
            request
        );

        return toCandidate(response.data.data);

    },

    async archive(id: string): Promise<Candidate> {

        const response = await candidatesApi.post<ApiResponse<CandidateResponse>>(
            `/candidates/${id}/archive`
        );

        return toCandidate(response.data.data);

    },

    async restore(id: string): Promise<Candidate> {

        const response = await candidatesApi.post<ApiResponse<CandidateResponse>>(
            `/candidates/${id}/restore`
        );

        return toCandidate(response.data.data);

    },

};
