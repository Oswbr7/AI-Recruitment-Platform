import type { ReactNode } from "react";

import { AuthBranding } from "../components/AuthBranding";

type Props = {
    children: ReactNode;
};

export function AuthLayout({ children }: Props) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">

            <AuthBranding />

            <div className="flex items-center justify-center p-8">
                {children}
            </div>

        </div>
    );
}
