import {
    BrainCircuit,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    LayoutDashboard,
    Settings,
    UserCog,
    Users,
} from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: typeof LayoutDashboard;
    /** Si se indica, solo visible para estos roles (claim "role" del usuario). */
    roles?: string[];
};

export const navigation: NavItem[] = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Candidates",
        href: "/candidates",
        icon: Users,
    },
    {
        title: "Jobs",
        href: "/jobs",
        icon: BriefcaseBusiness,
    },
    {
        title: "Companies",
        href: "/companies",
        icon: Building2,
    },
    {
        title: "AI Matching",
        href: "/matching",
        icon: BrainCircuit,
    },
    {
        title: "Interviews",
        href: "/interviews",
        icon: CalendarDays,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: UserCog,
        roles: ["Admin"],
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];
