import { companiesApi } from "@/shared/api/companyApiClient";
import type { ApiResponse } from "@/shared/api/types";

import { toCompanyContact } from "../api/mappers/companyContactMapper";
import type { CompanyContactResponse } from "../api/dto/CompanyContactResponse";
import type { CompanyContact } from "../models/CompanyContact";
import type { AddCompanyContactRequest } from "../types/AddCompanyContactRequest";
import type { UpdateCompanyContactRequest } from "../types/UpdateCompanyContactRequest";

export const companyContactApi = {

    async getByCompanyId(companyId: string): Promise<CompanyContact[]> {

        const response = await companiesApi.get<ApiResponse<CompanyContactResponse[]>>(
            `/companies/${companyId}/contacts`
        );

        return response.data.data.map(toCompanyContact);

    },

    async add(companyId: string, request: AddCompanyContactRequest): Promise<CompanyContact> {

        const response = await companiesApi.post<ApiResponse<CompanyContactResponse>>(
            `/companies/${companyId}/contacts`,
            request
        );

        return toCompanyContact(response.data.data);

    },

    async update(companyId: string, contactId: string, request: UpdateCompanyContactRequest): Promise<CompanyContact> {

        const response = await companiesApi.put<ApiResponse<CompanyContactResponse>>(
            `/companies/${companyId}/contacts/${contactId}`,
            request
        );

        return toCompanyContact(response.data.data);

    },

    async remove(companyId: string, contactId: string): Promise<void> {

        await companiesApi.delete(`/companies/${companyId}/contacts/${contactId}`);

    },

};
