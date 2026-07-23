import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {

    variant:
        | "success"
        | "warning"
        | "danger"
        | "info";

    children: ReactNode;

}

const variantClassNames: Record<Props["variant"], string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
};

export function StatusBadge({
    variant,
    children,
}: Props) {

    return (

        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                variantClassNames[variant]
            )}
        >

            {children}

        </span>

    );

}
