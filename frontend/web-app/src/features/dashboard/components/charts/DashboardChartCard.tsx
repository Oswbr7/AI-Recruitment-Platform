import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    title: string;
    children: ReactElement;
    height?: number;
};

export function DashboardChartCard({ title, children, height = 300 }: Props) {

    return (

        <Card>

            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent style={{ height }}>

                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

}
