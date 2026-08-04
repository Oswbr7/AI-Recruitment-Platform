import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
    lastUpdated: Date;
    onRefresh: () => void;
};

export function DashboardHeader({ lastUpdated, onRefresh }: Props) {

    const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (

        <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-muted-foreground">
                    Welcome back. Here's what's happening today — {today}.
                </p>

            </div>

            <div className="flex items-center gap-3">

                <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated.toLocaleTimeString()}
                </span>

                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Refresh
                </Button>

            </div>

        </div>

    );

}
