import { z } from "zod";

export const companySchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(200),

    industry: z
        .string()
        .min(1, "Industry is required"),

    legalName: z.string().trim().max(200).optional(),

    taxId: z.string().trim().max(50).optional(),

    website: z.string().trim().max(300).optional(),

    email: z
        .string()
        .trim()
        .email("Enter a valid email")
        .max(200)
        .optional()
        .or(z.literal("")),

    phone: z.string().trim().max(30).optional(),

    description: z.string().trim().optional(),

    logoUrl: z.string().trim().max(300).optional(),

    companySize: z.string().optional(),

    foundedYear: z.coerce.number().min(1800).max(2100).optional(),

    country: z.string().trim().max(100).optional(),

    state: z.string().trim().max(100).optional(),

    city: z.string().trim().max(100).optional(),

    address: z.string().trim().max(300).optional(),

    postalCode: z.string().trim().max(20).optional(),

});

export type CompanyFormValues = z.infer<typeof companySchema>;
