import type { ColumnDef } from "@tanstack/react-table";

import type { Job } from "../types/Job";

export const jobColumns: ColumnDef<Job>[] = [

    {

        accessorKey: "title",

        header: "Title",

    },

    {

        accessorKey: "department",

        header: "Department",

    },

    {

        accessorKey: "location",

        header: "Location",

    },

    {

        accessorKey: "status",

        header: "Status",

    },

];