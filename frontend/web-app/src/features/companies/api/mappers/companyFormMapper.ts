import type { CompanyFormValues } from "../../schemas/companySchema";
import type { CreateCompanyRequest } from "../../types/CreateCompanyRequest";
import type { UpdateCompanyRequest } from "../../types/UpdateCompanyRequest";
import type { Company } from "../../models/Company";

export function toCreateCompanyRequest(values: CompanyFormValues): CreateCompanyRequest {

    return {

        name: values.name,

        industry: values.industry,

        legalName: values.legalName || undefined,

        taxId: values.taxId || undefined,

        website: values.website || undefined,

        email: values.email || undefined,

        phone: values.phone || undefined,

        description: values.description || undefined,

        companySize: values.companySize || undefined,

        foundedYear: values.foundedYear,

        country: values.country || undefined,

        state: values.state || undefined,

        city: values.city || undefined,

        address: values.address || undefined,

        postalCode: values.postalCode || undefined,

    };

}

export function toUpdateCompanyRequest(values: CompanyFormValues): UpdateCompanyRequest {

    return toCreateCompanyRequest(values);

}

export function toCompanyFormValues(company: Company): CompanyFormValues {

    return {

        name: company.name,

        industry: company.industry,

        legalName: company.legalName ?? "",

        taxId: company.taxId ?? "",

        website: company.website ?? "",

        email: company.email ?? "",

        phone: company.phone ?? "",

        description: company.description ?? "",

        logoUrl: company.logoUrl ?? "",

        companySize: company.companySize ?? "",

        foundedYear: company.foundedYear,

        country: company.country ?? "",

        state: company.state ?? "",

        city: company.city ?? "",

        address: company.address ?? "",

        postalCode: company.postalCode ?? "",

    };

}
