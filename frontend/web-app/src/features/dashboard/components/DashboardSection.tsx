import type { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export function DashboardSection({ title, children }: Props) {

    return (

        <div className="space-y-6">

            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

            {children}

        </div>

    );

}
