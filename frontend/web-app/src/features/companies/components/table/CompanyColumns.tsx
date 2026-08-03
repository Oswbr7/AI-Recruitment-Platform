import type { ColumnDef } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/shared/components/data-table/DataTableColumnHeader";

import type { Company } from "../../models/Company";
import { CompanyStatusBadge } from "../badges/CompanyStatusBadge";
import { CompanyActionsMenu } from "../actions/CompanyActionsMenu";

export function getCompanyColumns(
    openJobsCountByCompany: Record<string, number>
): ColumnDef<Company>[] {

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

            id: "logo",

            header: "",

            cell: ({ row }) => (

                <Avatar size="sm">
                    <AvatarImage src={row.original.logoUrl} alt={row.original.name} />
                    <AvatarFallback>
                        <Building2 className="h-3.5 w-3.5" />
                    </AvatarFallback>
                </Avatar>

            ),

            enableSorting: false,

            enableHiding: false,

        },

        {

            accessorKey: "name",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),

        },

        {

            accessorKey: "industry",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Industry" />
            ),

        },

        {

            accessorKey: "companySize",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Company Size" />
            ),

            cell: ({ row }) => row.original.companySize ?? "—",

            enableSorting: false,

        },

        {

            accessorKey: "country",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Country" />
            ),

            cell: ({ row }) => row.original.country ?? "—",

        },

        {

            id: "openJobs",

            header: "Open Jobs",

            cell: ({ row }) => openJobsCountByCompany[row.original.id] ?? 0,

            enableSorting: false,

        },

        {

            accessorKey: "status",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),

            cell: ({ row }) => (
                <CompanyStatusBadge status={row.original.status} />
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
                <CompanyActionsMenu company={row.original} />
            ),

            enableSorting: false,

            enableHiding: false,

        },

    ];

}
