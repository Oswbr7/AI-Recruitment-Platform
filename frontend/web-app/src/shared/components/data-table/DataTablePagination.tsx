import type { Table } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props<TData> {

    table: Table<TData>;

}

export function DataTablePagination<TData>({
    table,
}: Props<TData>) {

    const selectedCount = table.getFilteredSelectedRowModel().rows.length;

    const totalCount = table.getFilteredRowModel().rows.length;

    return (

        <div className="flex items-center justify-between px-1">

            <div className="text-sm text-muted-foreground">

                {selectedCount > 0
                    ? `${selectedCount} of ${totalCount} row(s) selected.`
                    : `${totalCount} row(s) total.`}

            </div>

            <div className="flex items-center gap-6">

                <div className="flex items-center gap-2">

                    <p className="text-sm font-medium">Rows per page</p>

                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={value => table.setPageSize(Number(value))}
                    >

                        <SelectTrigger className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>

                            {[10, 20, 30, 50].map(pageSize => (

                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>

                            ))}

                        </SelectContent>

                    </Select>

                </div>

                <div className="flex w-[110px] items-center justify-center text-sm font-medium">

                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount() || 1}

                </div>

                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>

                </div>

            </div>

        </div>

    );

}
