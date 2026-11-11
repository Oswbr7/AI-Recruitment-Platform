import { z } from "zod";


export const registerSchema = z.object({

    firstName: z
        .string()
        .trim()
        .min(1, "First name is required."),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required."),

    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    // Paridad con RegisterUserCommandValidator del backend (min 6).
    password: z
        .string()
        .min(6, "Password must contain at least 6 characters.")

});

export type RegisterFormValues =
    z.infer<typeof registerSchema>;
