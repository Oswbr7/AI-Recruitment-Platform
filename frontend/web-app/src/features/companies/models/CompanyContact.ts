export interface CompanyContact {

    id: string;

    companyId: string;

    firstName: string;

    lastName: string;

    email: string;

    phone?: string;

    position?: string;

    isPrimaryContact: boolean;

    createdAt: Date;

    updatedAt: Date;
}
