import { PageContainer } from "@/shared/components/page/PageContainer";
import { PageHeader } from "@/shared/components/page/PageHeader";

import { useAuthStore } from "@/features/auth/store/authStore";

import { ChangePasswordForm } from "../components/ChangePasswordForm";

export function SettingsPage() {
    const user = useAuthStore((s) => s.user);

    return (
        <PageContainer>
            <PageHeader title="Settings" description="Your profile and account security." />

            <div className="mb-8 max-w-md rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">Profile</h2>

                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="font-medium">{user?.fullName ?? "—"}</dd>
                    </div>

                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium">{user?.email ?? "—"}</dd>
                    </div>

                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Role</dt>
                        <dd className="font-medium">{user?.role ?? "—"}</dd>
                    </div>
                </dl>
            </div>

            <div className="max-w-md">
                <h2 className="mb-4 text-lg font-semibold">Change password</h2>

                <ChangePasswordForm />
            </div>
        </PageContainer>
    );
}
