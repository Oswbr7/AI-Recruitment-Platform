import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

import { DashboardChartCard } from "./DashboardChartCard";

type DataPoint = Record<string, string | number>;

type Props = {
    title: string;
    data: DataPoint[];
    categoryKey: string;
    valueKey?: string;
};

export function DashboardLineChart({ title, data, categoryKey, valueKey = "value" }: Props) {

    return (

        <DashboardChartCard title={title}>

            <LineChart data={data}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey={categoryKey} />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line type="monotone" dataKey={valueKey} strokeWidth={2} dot />

            </LineChart>

        </DashboardChartCard>

    );

}
