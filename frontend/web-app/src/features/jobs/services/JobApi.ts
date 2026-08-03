import { jobsApi } from "@/shared/api/jobsApiClient";
import type { ApiResponse } from "@/shared/api/types";

import { toJob } from "../api/mappers/jobMapper";
import type { JobResponse } from "../api/dto/JobResponse";
import type { Job } from "../models/Job";
import type { CreateJobRequest } from "../types/CreateJobRequest";
import type { CreateJobResponse } from "../types/CreateJobResponse";
import type { UpdateJobRequest } from "../types/UpdateJobRequest";
import type { GetJobsParams } from "../types/GetJobsParams";

export const jobApi = {

    async create(request: CreateJobRequest): Promise<CreateJobResponse> {

        const response = await jobsApi.post<ApiResponse<CreateJobResponse>>(
            "/jobs",
            request
        );

        return response.data.data;

    },

    async getJobs(params?: GetJobsParams): Promise<Job[]> {

        const response = await jobsApi.get<ApiResponse<JobResponse[]>>(
            "/jobs",
            { params }
        );

        return response.data.data.map(toJob);

    },

    async getById(id: string): Promise<Job> {

        const response = await jobsApi.get<ApiResponse<JobResponse>>(
            `/jobs/${id}`
        );

        return toJob(response.data.data);

    },

    async update(id: string, request: UpdateJobRequest): Promise<Job> {

        const response = await jobsApi.put<ApiResponse<JobResponse>>(
            `/jobs/${id}`,
            request
        );

        return toJob(response.data.data);

    },

    async remove(id: string): Promise<void> {

        await jobsApi.delete(`/jobs/${id}`);

    },

    async publish(id: string): Promise<Job> {

        const response = await jobsApi.post<ApiResponse<JobResponse>>(
            `/jobs/${id}/publish`
        );

        return toJob(response.data.data);

    },

    async close(id: string): Promise<Job> {

        const response = await jobsApi.post<ApiResponse<JobResponse>>(
            `/jobs/${id}/close`
        );

        return toJob(response.data.data);

    },

    async archive(id: string): Promise<Job> {

        const response = await jobsApi.post<ApiResponse<JobResponse>>(
            `/jobs/${id}/archive`
        );

        return toJob(response.data.data);

    },

    async reopen(id: string): Promise<Job> {

        const response = await jobsApi.post<ApiResponse<JobResponse>>(
            `/jobs/${id}/reopen`
        );

        return toJob(response.data.data);

    },

    async duplicate(id: string): Promise<CreateJobResponse> {

        const response = await jobsApi.post<ApiResponse<CreateJobResponse>>(
            `/jobs/${id}/duplicate`
        );

        return response.data.data;

    },

};
