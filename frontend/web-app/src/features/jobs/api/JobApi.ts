import { api } from "@/shared/api/apiClient";

import type { Job } from "../types/Job";

export class JobApi {

    static async getJobs() {

        const response =
            await api.get<Job[]>("/jobs");

        return response.data;

    }

}