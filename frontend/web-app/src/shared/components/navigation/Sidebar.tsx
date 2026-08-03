import { cn } from "@/lib/utils";

import { useLayoutStore } from "@/shared/store/layoutStore";

import { AppLogo } from "../common/AppLogo";
import { NavigationMenu } from "./NavigationMenu";
import { UserSection } from "../common/UserSection";
import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    Building2,
    BrainCircuit,
    CalendarDays,
    Settings
} from "lucide-react";

export function Sidebar() {

    const collapsed =
        useLayoutStore(
            state => state.sidebarCollapsed
        );

    return (

        <aside
            className={cn(
                "flex flex-col border-r bg-background transition-all duration-300",
                collapsed
                    ? "w-20"
                    : "w-72"
            )}
        >

            <AppLogo
                collapsed={collapsed}
            />

            <div className="flex-1">

                <NavigationMenu
                    collapsed={collapsed}
                />

            </div>

            <UserSection
                collapsed={collapsed}
            />

        </aside>

    );

}

export const menu = [

    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/"
    },

    {
        title: "Candidates",
        icon: Users,
        href: "/candidates"
    },

    {
        title: "Jobs",
        icon: BriefcaseBusiness,
        href: "/jobs"
    },

    {
        title: "Companies",
        icon: Building2,
        href: "/companies"
    },

    {
        title: "AI Matching",
        icon: BrainCircuit,
        href: "/matching"
    },

    {
        title: "Interviews",
        icon: CalendarDays,
        href: "/interviews"
    },

    {
        title: "Settings",
        icon: Settings,
        href: "/settings"
    }

];