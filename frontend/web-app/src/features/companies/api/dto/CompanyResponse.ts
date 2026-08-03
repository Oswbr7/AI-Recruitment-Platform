export interface CompanyResponse {

    id: string;

    name: string;

    legalName: string | null;

    taxId: string | null;

    industry: string;

    website: string | null;

    email: string | null;

    phone: string | null;

    description: string | null;

    logoUrl: string | null;

    companySize: string | null;

    foundedYear: number | null;

    country: string | null;

    state: string | null;

    city: string | null;

    address: string | null;

    postalCode: string | null;

    status: string;

    createdAt: string;

    updatedAt: string;

}
