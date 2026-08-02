import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Download, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { exportTableToCsv } from "./exportTableToCsv";

interface Props<TData> {

    table: Table<TData>;

    searchPlaceholder?: string;

    exportFilename?: string;

    bulkActionsBar?: ReactNode;

    filtersSlot?: ReactNode;

}

export function DataTableToolbar<TData>({
    table,
    searchPlaceholder = "Search...",
    exportFilename = "export.csv",
    bulkActionsBar,
    filtersSlot,
}: Props<TData>) {

    return (

        <div className="flex items-center justify-between gap-4">

            <div className="flex flex-1 items-center gap-3">

                <div className="relative w-full max-w-sm">

                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder={searchPlaceholder}
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={event => table.setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />

                </div>

                {filtersSlot}

                {bulkActionsBar}

            </div>

            <div className="flex items-center gap-2">

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportTableToCsv(table, exportFilename)}
                >
                    <Download className="mr-1.5 h-4 w-4" />
                    Export CSV
                </Button>

                <DropdownMenu>

                    <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                        Columns
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        {table
                            .getAllColumns()
                            .filter(column => column.getCanHide())
                            .map(column => (

                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={value => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>

                            ))}

                    </DropdownMenuContent>

                </DropdownMenu>

            </div>

        </div>

    );

}
