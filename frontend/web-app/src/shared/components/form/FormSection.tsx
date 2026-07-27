import type { ReactNode } from "react";

interface Props {

    title: string;

    description?: string;

    children: ReactNode;

}

export function FormSection({

    title,

    description,

    children

}: Props) {

    return (

        <section className="space-y-4">

            <div>

                <h3 className="font-semibold text-lg">

                    {title}

                </h3>

                {description && (

                    <p className="text-sm text-muted-foreground">

                        {description}

                    </p>

                )}

            </div>

            {children}

        </section>

    );

}