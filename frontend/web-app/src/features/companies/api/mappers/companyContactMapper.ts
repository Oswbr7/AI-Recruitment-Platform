import type { CompanyContact } from "../../models/CompanyContact";
import type { CompanyContactResponse } from "../dto/CompanyContactResponse";

export function toCompanyContact(response: CompanyContactResponse): CompanyContact {

    return {

        id: response.id,

        companyId: response.companyId,

        firstName: response.firstName,

        lastName: response.lastName,

        email: response.email,

        phone: response.phone ?? undefined,

        position: response.position ?? undefined,

        isPrimaryContact: response.isPrimaryContact,

        createdAt: new Date(response.createdAt),

        updatedAt: new Date(response.updatedAt),

    };

}
