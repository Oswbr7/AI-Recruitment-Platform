import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    LabelList,
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
        percentage?: number;
    }[];
};

export function HiringPipeline({ data }: Props) {
    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    Hiring Funnel
                </CardTitle>

            </CardHeader>

            <CardContent className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="stage" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Bar dataKey="value" radius={6}>

                            <LabelList
                                dataKey="percentage"
                                position="top"
                                formatter={(value: string | number | boolean | null | undefined) =>
                                    value == null ? "" : `${value}%`
                                }
                            />

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>
    );
}