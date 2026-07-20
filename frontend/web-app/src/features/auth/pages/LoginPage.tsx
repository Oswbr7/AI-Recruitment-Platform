import { AuthCard } from "../components/AuthCard";
import { AuthHeader } from "../components/AuthHeader";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
    return (
        <AuthLayout>

            <AuthCard>

                <AuthHeader />

                <LoginForm />

            </AuthCard>

        </AuthLayout>
    );
}
