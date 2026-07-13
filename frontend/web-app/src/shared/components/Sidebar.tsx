import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    BrainCircuit,
    CalendarDays,
    Settings
} from "lucide-react";

const menu = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/"
    },
    {
        label: "Candidates",
        icon: Users,
        path: "/candidates"
    },
    {
        label: "Jobs",
        icon: BriefcaseBusiness,
        path: "/jobs"
    },
    {
        label: "AI Matching",
        icon: BrainCircuit,
        path: "/matching"
    },
    {
        label: "Interviews",
        icon: CalendarDays,
        path: "/interviews"
    },
    {
        label: "Settings",
        icon: Settings,
        path: "/settings"
    }
];