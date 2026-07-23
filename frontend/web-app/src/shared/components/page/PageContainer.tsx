import type { ReactNode } from "react";

interface Props {

    children: ReactNode;

}

export function PageContainer({
    children,
}: Props) {

    return (

        <div className="space-y-8 p-8">

            {children}

        </div>

    );

}
