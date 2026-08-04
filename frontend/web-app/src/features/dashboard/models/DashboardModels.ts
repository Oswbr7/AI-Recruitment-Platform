import type { LucideIcon } from "lucide-react";

export interface ActivityEvent {

    id: string;

    type: string;

    title: string;

    description?: string;

    createdAt: Date;

    icon: LucideIcon;

    color: string;

}

export interface RankedItem {

    label: string;

    value: number;

}
