import { httpClient } from "@/shared/api/httpClient";

import {

    CreateJobRequest,

} from "../types/CreateJobRequest";

import {

    CreateJobResponse,

} from "../types/CreateJobResponse";

export const jobApi = {

    async create(

        request: CreateJobRequest

    ): Promise<CreateJobResponse> {

        const response = await httpClient.post<CreateJobResponse>(

            "/jobs",

            request

        );

        return response.data;

    }

};