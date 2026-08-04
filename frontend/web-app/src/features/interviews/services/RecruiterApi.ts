import { api } from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/types";

import { toRecruiter } from "../api/mappers/recruiterMapper";
import type { RecruiterResponse } from "../api/dto/RecruiterResponse";
import type { Recruiter } from "../models/Recruiter";

export const recruiterApi = {

    async getAll(): Promise<Recruiter[]> {

        const response = await api.get<ApiResponse<RecruiterResponse[]>>(
            "/users",
            { params: { role: "Recruiter" } }
        );

        return response.data.data.map(toRecruiter);

    },

};
