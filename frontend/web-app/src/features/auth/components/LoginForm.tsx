import { Link, useNavigate } from "react-router-dom";

import { Mail } from "lucide-react";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { TextField } from "@/shared/components/form/TextField";
import { PasswordField } from "@/shared/components/form/PasswordField";
import { SubmitButton } from "@/shared/components/form/SubmitButton";

import {
    loginSchema,
    type LoginFormValues,
} from "../schemas/LoginSchema";

import { useLogin } from "../hooks/useLogin";

export function LoginForm() {

    const navigate = useNavigate();

    const loginMutation = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: LoginFormValues) {

        loginMutation.mutate(values, {

            onSuccess() {

                toast.success("Welcome back!");

                navigate("/");

            },

            onError(error: any) {

                toast.error(

                    error?.response?.data?.message ??

                    "Invalid email or password."

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

                <div className="flex items-center justify-between text-sm">

                    <Link
                        to="/forgot-password"
                        className="text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>

                </div>

                <SubmitButton
                    loading={loginMutation.isPending}
                >
                    Sign In
                </SubmitButton>

                <p className="text-center text-sm text-muted-foreground">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </form>

        </Form>

    );

}