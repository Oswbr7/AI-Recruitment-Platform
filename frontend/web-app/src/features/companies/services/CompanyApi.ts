import { companiesApi } from "@/shared/api/companyApiClient";
import type { ApiResponse, PagedResult } from "@/shared/api/types";

import { toCompany } from "../api/mappers/companyMapper";
import type { CompanyResponse } from "../api/dto/CompanyResponse";
import type { Company } from "../models/Company";
import type { CreateCompanyRequest } from "../types/CreateCompanyRequest";
import type { CreateCompanyResponse } from "../types/CreateCompanyResponse";
import type { UpdateCompanyRequest } from "../types/UpdateCompanyRequest";
import type { GetCompaniesParams } from "../types/GetCompaniesParams";

export const companyApi = {

    async create(request: CreateCompanyRequest): Promise<CreateCompanyResponse> {

        const response = await companiesApi.post<ApiResponse<CreateCompanyResponse>>(
            "/companies",
            request
        );

        return response.data.data;

    },

    async getPaged(params: GetCompaniesParams): Promise<PagedResult<Company>> {

        const response = await companiesApi.get<ApiResponse<PagedResult<CompanyResponse>>>(
            "/companies",
            { params }
        );

        return {

            ...response.data.data,

            items: response.data.data.items.map(toCompany),

        };

    },

    async getById(id: string): Promise<Company> {

        const response = await companiesApi.get<ApiResponse<CompanyResponse>>(
            `/companies/${id}`
        );

        return toCompany(response.data.data);

    },

    async update(id: string, request: UpdateCompanyRequest): Promise<Company> {

        const response = await companiesApi.put<ApiResponse<CompanyResponse>>(
            `/companies/${id}`,
            request
        );

        return toCompany(response.data.data);

    },

    async remove(id: string): Promise<void> {

        await companiesApi.delete(`/companies/${id}`);

    },

    async archive(id: string): Promise<Company> {

        const response = await companiesApi.post<ApiResponse<CompanyResponse>>(
            `/companies/${id}/archive`
        );

        return toCompany(response.data.data);

    },

    async restore(id: string): Promise<Company> {

        const response = await companiesApi.post<ApiResponse<CompanyResponse>>(
            `/companies/${id}/restore`
        );

        return toCompany(response.data.data);

    },

    async updateLogo(id: string, logoUrl: string | undefined): Promise<Company> {

        const response = await companiesApi.put<ApiResponse<CompanyResponse>>(
            `/companies/${id}/logo`,
            { logoUrl }
        );

        return toCompany(response.data.data);

    },

};
