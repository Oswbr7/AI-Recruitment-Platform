import { AuthCard } from "../components/AuthCard";
import { AuthHeader } from "../components/AuthHeader";
import { AuthLayout } from "../layouts/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
    return (
        <AuthLayout>
            <AuthCard>
                <AuthHeader />

                <RegisterForm />
            </AuthCard>
        </AuthLayout>
    );
}
