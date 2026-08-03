import { z } from "zod";

export const candidateSchema = z.object({

    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100),

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email")
        .max(200),

    phone: z.string().trim().max(30).optional(),

    location: z.string().trim().max(150).optional(),

    headline: z.string().trim().max(200).optional(),

    summary: z.string().trim().optional(),

    linkedInUrl: z.string().trim().max(300).optional(),

    githubUrl: z.string().trim().max(300).optional(),

    portfolioUrl: z.string().trim().max(300).optional(),

    currentCompany: z.string().trim().max(150).optional(),

    currentPosition: z.string().trim().max(150).optional(),

    yearsOfExperience: z.coerce.number().min(0).optional(),

    expectedSalary: z.coerce.number().min(0).optional(),

    currency: z.string().trim().max(3).optional(),

});

export type CandidateFormValues = z.infer<typeof candidateSchema>;
