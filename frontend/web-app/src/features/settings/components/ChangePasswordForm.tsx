import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { PasswordField } from "@/shared/components/form/PasswordField";
import { SubmitButton } from "@/shared/components/form/SubmitButton";

import {
    changePasswordSchema,
    type ChangePasswordFormValues,
} from "../schemas/ChangePasswordSchema";

import { useChangePassword } from "../hooks/useChangePassword";

export function ChangePasswordForm() {
    const navigate = useNavigate();

    const changeMutation = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: ChangePasswordFormValues) {
        changeMutation.mutate(
            {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
            {
                onSuccess() {
                    toast.success("Password updated. Please sign in again.");
                    navigate("/login");
                },
                onError(error: any) {
                    toast.error(error?.response?.data?.message ?? "Could not update the password.");
                },
            },
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-6">
                <PasswordField
                    control={form.control}
                    name="currentPassword"
                    label="Current password"
                    placeholder="••••••••"
                />

                <PasswordField
                    control={form.control}
                    name="newPassword"
                    label="New password"
                    placeholder="••••••••"
                />

                <PasswordField
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm new password"
                    placeholder="••••••••"
                />

                <SubmitButton loading={changeMutation.isPending}>Update password</SubmitButton>
            </form>
        </Form>
    );
}
