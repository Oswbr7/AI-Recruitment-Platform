export const CompanyStatus = {
    Active: "Active",
    Archived: "Archived",
} as const;

export type CompanyStatus = typeof CompanyStatus[keyof typeof CompanyStatus];

export const CompanySize = {
    Startup: "Startup",
    Small: "Small",
    Medium: "Medium",
    Large: "Large",
    Enterprise: "Enterprise",
} as const;

export type CompanySize = typeof CompanySize[keyof typeof CompanySize];

export const Industry = {
    Technology: "Technology",
    Finance: "Finance",
    Healthcare: "Healthcare",
    Retail: "Retail",
    Education: "Education",
    Manufacturing: "Manufacturing",
    Government: "Government",
    Other: "Other",
} as const;

export type Industry = typeof Industry[keyof typeof Industry];

export interface Company {

    id: string;

    name: string;

    legalName?: string;

    taxId?: string;

    industry: Industry;

    website?: string;

    email?: string;

    phone?: string;

    description?: string;

    logoUrl?: string;

    companySize?: CompanySize;

    foundedYear?: number;

    country?: string;

    state?: string;

    city?: string;

    address?: string;

    postalCode?: string;

    status: CompanyStatus;

    createdAt: Date;

    updatedAt: Date;
}
