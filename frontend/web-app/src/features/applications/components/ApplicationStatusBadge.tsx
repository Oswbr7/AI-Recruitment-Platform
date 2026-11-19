import { ApplicationStatus } from "../types/Application";

const STYLES: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Reviewing: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Interviewing: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    Offered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Withdrawn: "bg-muted text-muted-foreground",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
    return (
        <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] ?? STYLES[ApplicationStatus.Applied]}`}
        >
            {status}
        </span>
    );
}
