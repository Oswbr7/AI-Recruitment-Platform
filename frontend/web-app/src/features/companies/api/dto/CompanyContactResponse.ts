export interface CompanyContactResponse {

    id: string;

    companyId: string;

    firstName: string;

    lastName: string;

    email: string;

    phone: string | null;

    position: string | null;

    isPrimaryContact: boolean;

    createdAt: string;

    updatedAt: string;

}
