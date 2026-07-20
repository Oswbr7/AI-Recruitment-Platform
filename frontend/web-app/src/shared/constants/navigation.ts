import {
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export const navigation = [
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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];