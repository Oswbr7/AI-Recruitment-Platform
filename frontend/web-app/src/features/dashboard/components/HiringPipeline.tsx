import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Props = {
    data: {
        stage: string;
        value: number;
    }[];
};

export function HiringPipeline({ data }: Props) {
    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    Hiring Pipeline
                </CardTitle>

            </CardHeader>

            <CardContent className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="stage" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="value" radius={6} />

                    </BarChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>
    );
}