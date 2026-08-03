import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/shared/components/data-table/DataTableColumnHeader";

import type { Candidate } from "../../models/Candidate";
import { CandidateStageBadge } from "../badges/CandidateStageBadge";
import { CandidateStatusBadge } from "../badges/CandidateStatusBadge";
import { CandidateActionsMenu } from "../actions/CandidateActionsMenu";

export const candidateColumns: ColumnDef<Candidate>[] = [

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

        accessorKey: "firstName",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" />
        ),

    },

    {

        accessorKey: "lastName",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" />
        ),

    },

    {

        accessorKey: "email",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),

    },

    {

        accessorKey: "currentPosition",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Position" />
        ),

        enableSorting: false,

    },

    {

        accessorKey: "currentCompany",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Current Company" />
        ),

        enableSorting: false,

    },

    {

        accessorKey: "yearsOfExperience",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Experience" />
        ),

        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.yearsOfExperience != null
                    ? `${row.original.yearsOfExperience} yrs`
                    : "—"}
            </span>
        ),

        enableSorting: false,

    },

    {

        accessorKey: "stage",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Stage" />
        ),

        cell: ({ row }) => (
            <CandidateStageBadge stage={row.original.stage} />
        ),

    },

    {

        accessorKey: "status",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),

        cell: ({ row }) => (
            <CandidateStatusBadge status={row.original.status} />
        ),

    },

    {

        accessorKey: "updatedAt",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),

        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.updatedAt.toLocaleDateString()}
            </span>
        ),

    },

    {

        id: "actions",

        cell: ({ row }) => (
            <CandidateActionsMenu candidate={row.original} />
        ),

        enableSorting: false,

        enableHiding: false,

    },

];
