import { z } from "zod";

export const jobSchema = z.object({

    title: z
        .string()
        .trim()
        .min(3, "Title must contain at least 3 characters")
        .max(150),

    department: z
        .string()
        .trim()
        .min(2, "Department is required"),

    location: z
        .string()
        .trim()
        .min(2, "Location is required"),

    description: z
        .string()
        .trim()
        .min(20, "Description must contain at least 20 characters"),

    employmentType: z.string().optional(),

    experienceLevel: z.string().optional(),

    remoteType: z.string().optional(),

    salaryMin: z.coerce.number().optional(),

    salaryMax: z.coerce.number().optional(),

    currency: z.string().optional()

});

export type JobFormValues = z.infer<typeof jobSchema>;