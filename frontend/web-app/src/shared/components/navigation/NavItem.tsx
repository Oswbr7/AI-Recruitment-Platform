import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  href: string;
  icon: LucideIcon;
  collapsed: boolean;
};

export function NavItem({
  title,
  href,
  icon: Icon,
  collapsed,
}: Props) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
          "hover:bg-accent",
          isActive && "bg-primary text-primary-foreground"
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      {!collapsed && <span>{title}</span>}
    </NavLink>
  );
}