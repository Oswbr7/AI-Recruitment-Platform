import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

import { DashboardChartCard } from "./DashboardChartCard";

type DataPoint = Record<string, string | number>;

type Props = {
    title: string;
    data: DataPoint[];
    categoryKey: string;
    valueKey?: string;
};

export function DashboardBarChart({ title, data, categoryKey, valueKey = "value" }: Props) {

    return (

        <DashboardChartCard title={title}>

            <BarChart data={data}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey={categoryKey} />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey={valueKey} radius={6} />

            </BarChart>

        </DashboardChartCard>

    );

}
