import { Card, CardContent } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

type Props = {

    title: string;

    value: string | number;

    icon: LucideIcon;

};

export function StatsCard({

    title,

    value,

    icon: Icon

}: Props) {

    return (

        <Card>

            <CardContent className="flex items-center justify-between p-6">

                <div>

                    <p className="text-sm text-muted-foreground">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold">

                        {value}

                    </h2>

                </div>

                <Icon className="h-10 w-10 text-primary" />

            </CardContent>

        </Card>

    );

}