import { AppLogo } from "@/shared/components/common/AppLogo";

export function AuthHeader() {
    return (
        <div className="space-y-4 text-center">

            <div className="flex justify-center">
                <AppLogo collapsed={false} />
            </div>

            <div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>

                <p className="text-muted-foreground">
                    Sign in to continue to AI Recruitment Platform
                </p>

            </div>

        </div>
    );
}