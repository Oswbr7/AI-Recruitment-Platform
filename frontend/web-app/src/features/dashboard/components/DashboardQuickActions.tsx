import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, UserPlus, CalendarPlus, Building2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
    { label: "Create Job", icon: BriefcaseBusiness, path: "/jobs" },
    { label: "Create Candidate", icon: UserPlus, path: "/candidates" },
    { label: "Schedule Interview", icon: CalendarPlus, path: "/interviews" },
    { label: "Create Company", icon: Building2, path: "/companies" },
];

export function DashboardQuickActions() {

    const navigate = useNavigate();

    return (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {actions.map(action => (

                <Card
                    key={action.label}
                    className="cursor-pointer transition hover:border-primary"
                    onClick={() => navigate(action.path, { state: { openCreate: true } })}
                >

                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">

                        <action.icon className="h-6 w-6 text-primary" />

                        <span className="text-sm font-medium">{action.label}</span>

                    </CardContent>

                </Card>

            ))}

        </div>

    );

}
