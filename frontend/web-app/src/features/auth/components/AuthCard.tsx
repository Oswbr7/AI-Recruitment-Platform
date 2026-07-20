import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export function AuthCard({ children }: Props) {

    return (

        <Card className="w-full max-w-md shadow-xl">

            <CardContent className="space-y-8 p-8">

                {children}

            </CardContent>

        </Card>

    );

}