import { interviewsApi } from "@/shared/api/interviewApiClient";
import type { ApiResponse, PagedResult } from "@/shared/api/types";

import { toInterview } from "../api/mappers/interviewMapper";
import type { InterviewResponse } from "../api/dto/InterviewResponse";
import type { Interview } from "../models/Interview";
import type { ScheduleInterviewRequest } from "../types/ScheduleInterviewRequest";
import type { ScheduleInterviewResponse } from "../types/ScheduleInterviewResponse";
import type { UpdateInterviewRequest } from "../types/UpdateInterviewRequest";
import type { GetInterviewsParams } from "../types/GetInterviewsParams";
import type { RescheduleInterviewRequest } from "../types/RescheduleInterviewRequest";

export const interviewApi = {

    async schedule(request: ScheduleInterviewRequest): Promise<ScheduleInterviewResponse> {

        const response = await interviewsApi.post<ApiResponse<ScheduleInterviewResponse>>(
            "/interviews",
            request
        );

        return response.data.data;

    },

    async getPaged(params: GetInterviewsParams): Promise<PagedResult<Interview>> {

        const response = await interviewsApi.get<ApiResponse<PagedResult<InterviewResponse>>>(
            "/interviews",
            { params }
        );

        return {

            ...response.data.data,

            items: response.data.data.items.map(toInterview),

        };

    },

    async getById(id: string): Promise<Interview> {

        const response = await interviewsApi.get<ApiResponse<InterviewResponse>>(
            `/interviews/${id}`
        );

        return toInterview(response.data.data);

    },

    async update(id: string, request: UpdateInterviewRequest): Promise<Interview> {

        const response = await interviewsApi.put<ApiResponse<InterviewResponse>>(
            `/interviews/${id}`,
            request
        );

        return toInterview(response.data.data);

    },

    async remove(id: string): Promise<void> {

        await interviewsApi.delete(`/interviews/${id}`);

    },

    async cancel(id: string): Promise<Interview> {

        const response = await interviewsApi.post<ApiResponse<InterviewResponse>>(
            `/interviews/${id}/cancel`
        );

        return toInterview(response.data.data);

    },

    async complete(id: string): Promise<Interview> {

        const response = await interviewsApi.post<ApiResponse<InterviewResponse>>(
            `/interviews/${id}/complete`
        );

        return toInterview(response.data.data);

    },

    async reschedule(id: string, request: RescheduleInterviewRequest): Promise<Interview> {

        const response = await interviewsApi.post<ApiResponse<InterviewResponse>>(
            `/interviews/${id}/reschedule`,
            request
        );

        return toInterview(response.data.data);

    },

};
