import { candidatesApi } from "@/shared/api/candidatesApiClient";
import type { ApiResponse } from "@/shared/api/types";

import { toCandidateNote } from "../api/mappers/candidateNoteMapper";
import type { CandidateNoteResponse } from "../api/dto/CandidateNoteResponse";
import type { CandidateNote } from "../models/CandidateNote";
import type { AddCandidateNoteRequest } from "../types/AddCandidateNoteRequest";
import type { UpdateCandidateNoteRequest } from "../types/UpdateCandidateNoteRequest";

export const candidateNoteApi = {

    async getByCandidateId(candidateId: string): Promise<CandidateNote[]> {

        const response = await candidatesApi.get<ApiResponse<CandidateNoteResponse[]>>(
            `/candidates/${candidateId}/notes`
        );

        return response.data.data.map(toCandidateNote);

    },

    async add(candidateId: string, content: string): Promise<CandidateNote> {

        const request: AddCandidateNoteRequest = { content };

        const response = await candidatesApi.post<ApiResponse<CandidateNoteResponse>>(
            `/candidates/${candidateId}/notes`,
            request
        );

        return toCandidateNote(response.data.data);

    },

    async update(candidateId: string, noteId: string, content: string): Promise<CandidateNote> {

        const request: UpdateCandidateNoteRequest = { content };

        const response = await candidatesApi.put<ApiResponse<CandidateNoteResponse>>(
            `/candidates/${candidateId}/notes/${noteId}`,
            request
        );

        return toCandidateNote(response.data.data);

    },

    async remove(candidateId: string, noteId: string): Promise<void> {

        await candidatesApi.delete(`/candidates/${candidateId}/notes/${noteId}`);

    },

};
