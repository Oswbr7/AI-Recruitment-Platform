import { z } from "zod";

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().trim().min(1, "Current password is required."),

        // Paridad con el backend (ChangePasswordValidator: min 8 y distinta a la actual).
        newPassword: z.string().min(8, "Password must contain at least 8 characters."),

        confirmPassword: z.string().trim().min(1, "Please confirm your new password."),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
