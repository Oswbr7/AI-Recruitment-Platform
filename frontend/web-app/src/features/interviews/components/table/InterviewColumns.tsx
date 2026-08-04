import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/shared/components/data-table/DataTableColumnHeader";

import type { Interview } from "../../models/Interview";
import { InterviewStageBadge } from "../badges/InterviewStageBadge";
import { InterviewStatusBadge } from "../badges/InterviewStatusBadge";
import { InterviewActionsMenu } from "../actions/InterviewActionsMenu";

export function getInterviewColumns(
    candidateNameById: Record<string, string>,
    jobTitleById: Record<string, string>,
    recruiterNameById: Record<string, string>
): ColumnDef<Interview>[] {

    return [

        {

            id: "select",

            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={
                        table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected()
                    }
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),

            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),

            enableSorting: false,

            enableHiding: false,

        },

        {

            id: "candidate",

            header: "Candidate",

            cell: ({ row }) => candidateNameById[row.original.candidateId] ?? "—",

            enableSorting: false,

        },

        {

            id: "job",

            header: "Job",

            cell: ({ row }) => jobTitleById[row.original.jobId] ?? "—",

            enableSorting: false,

        },

        {

            id: "recruiter",

            header: "Recruiter",

            cell: ({ row }) => recruiterNameById[row.original.recruiterId] ?? "—",

            enableSorting: false,

        },

        {

            accessorKey: "interviewType",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Interview Type" />
            ),

            enableSorting: false,

        },

        {

            accessorKey: "interviewStage",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Stage" />
            ),

            cell: ({ row }) => (
                <InterviewStageBadge stage={row.original.interviewStage} />
            ),

        },

        {

            accessorKey: "scheduledAt",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Scheduled Date" />
            ),

            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.scheduledAt.toLocaleString()}
                </span>
            ),

        },

        {

            accessorKey: "status",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),

            cell: ({ row }) => (
                <InterviewStatusBadge status={row.original.status} />
            ),

        },

        {

            id: "actions",

            cell: ({ row }) => (
                <InterviewActionsMenu interview={row.original} />
            ),

            enableSorting: false,

            enableHiding: false,

        },

    ];

}
