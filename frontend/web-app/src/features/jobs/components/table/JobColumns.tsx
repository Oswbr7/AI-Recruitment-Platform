import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/shared/components/data-table/DataTableColumnHeader";

import type { Job } from "../../models/Job";
import { JobStatusBadge } from "../badges/JobStatusBadge";
import { JobActionsMenu } from "../actions/JobActionsMenu";

export const jobColumns: ColumnDef<Job>[] = [

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

        accessorKey: "title",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),

    },

    {

        accessorKey: "department",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Department" />
        ),

    },

    {

        accessorKey: "location",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Location" />
        ),

    },

    {

        accessorKey: "employmentType",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employment" />
        ),

    },

    {

        accessorKey: "status",

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),

        cell: ({ row }) => (
            <JobStatusBadge status={row.original.status} />
        ),

        filterFn: "arrIncludesSome",

    },

    {

        id: "actions",

        cell: ({ row }) => (
            <JobActionsMenu job={row.original} />
        ),

        enableSorting: false,

        enableHiding: false,

    },

];
