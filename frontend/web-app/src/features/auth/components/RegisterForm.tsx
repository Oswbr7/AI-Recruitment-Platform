import { Link, useNavigate } from "react-router-dom";

import { Mail, User } from "lucide-react";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { TextField } from "@/shared/components/form/TextField";
import { PasswordField } from "@/shared/components/form/PasswordField";
import { SubmitButton } from "@/shared/components/form/SubmitButton";

import {
    registerSchema,
    type RegisterFormValues,
} from "../schemas/RegisterSchema";

import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {

    const navigate = useNavigate();

    const registerMutation = useRegister();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: RegisterFormValues) {

        registerMutation.mutate(values, {

            onSuccess() {

                toast.success(
                    "Account created! Sign in with your new credentials."
                );

                navigate("/login");

            },

            onError(error: any) {

                toast.error(

                    error?.response?.data?.message ??

                    "Could not create the account."

                );

            },

        });

    }

    return (

        <Form {...form}>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >

                <div className="grid grid-cols-2 gap-4">

                    <TextField
                        control={form.control}
                        name="firstName"
                        label="First name"
                        placeholder="John"
                        icon={User}
                    />

                    <TextField
                        control={form.control}
                        name="lastName"
                        label="Last name"
                        placeholder="Doe"
                        icon={User}
                    />

                </div>

                <TextField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                    icon={Mail}
                />

                <PasswordField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                />

                <SubmitButton
                    loading={registerMutation.isPending}
                >
                    Create account
                </SubmitButton>

                <p className="text-center text-sm text-muted-foreground">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>

                </p>

            </form>

        </Form>

    );

}
