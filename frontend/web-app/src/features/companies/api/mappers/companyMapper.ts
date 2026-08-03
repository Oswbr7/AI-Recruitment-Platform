import type { Company } from "../../models/Company";
import type { CompanyResponse } from "../dto/CompanyResponse";

export function toCompany(response: CompanyResponse): Company {

    return {

        id: response.id,

        name: response.name,

        legalName: response.legalName ?? undefined,

        taxId: response.taxId ?? undefined,

        industry: response.industry as Company["industry"],

        website: response.website ?? undefined,

        email: response.email ?? undefined,

        phone: response.phone ?? undefined,

        description: response.description ?? undefined,

        logoUrl: response.logoUrl ?? undefined,

        companySize: response.companySize as Company["companySize"] ?? undefined,

        foundedYear: response.foundedYear ?? undefined,

        country: response.country ?? undefined,

        state: response.state ?? undefined,

        city: response.city ?? undefined,

        address: response.address ?? undefined,

        postalCode: response.postalCode ?? undefined,

        status: response.status as Company["status"],

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
