import { useState } from "react";
import type { ReactNode } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    ColumnFiltersState,
    OnChangeFn,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import type { RenderBulkActions, RenderFilters } from "./Types";

function useTableState<T>(
    controlled: T | undefined,
    onChange: OnChangeFn<T> | undefined,
    initial: T
): [T, OnChangeFn<T>] {

    const [internal, setInternal] = useState<T>(initial);

    return [controlled ?? internal, onChange ?? setInternal];

}

type Props<TData> = {

    columns: ColumnDef<TData>[];

    data: TData[];

    searchPlaceholder?: string;

    exportFilename?: string;

    renderBulkActions?: RenderBulkActions<TData>;

    renderFilters?: RenderFilters<TData>;

    // Server-side / manual mode. Omit these to keep the default
    // client-side pagination/sorting/filtering behavior.
    manualPagination?: boolean;

    pageCount?: number;

    pagination?: PaginationState;

    onPaginationChange?: OnChangeFn<PaginationState>;

    manualSorting?: boolean;

    sorting?: SortingState;

    onSortingChange?: OnChangeFn<SortingState>;

    manualFiltering?: boolean;

    globalFilter?: string;

    onGlobalFilterChange?: OnChangeFn<string>;

    columnFilters?: ColumnFiltersState;

    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

};

export function DataTable<TData>({
    columns,
    data,
    searchPlaceholder,
    exportFilename,
    renderBulkActions,
    renderFilters,
    manualPagination = false,
    pageCount,
    pagination: paginationProp,
    onPaginationChange,
    manualSorting = false,
    sorting: sortingProp,
    onSortingChange,
    manualFiltering = false,
    globalFilter: globalFilterProp,
    onGlobalFilterChange,
    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
}: Props<TData>) {

    const [pagination, setPagination] = useTableState<PaginationState>(
        paginationProp, onPaginationChange, { pageIndex: 0, pageSize: 10 }
    );

    const [sorting, setSorting] = useTableState<SortingState>(
        sortingProp, onSortingChange, []
    );

    const [columnFilters, setColumnFilters] = useTableState<ColumnFiltersState>(
        columnFiltersProp, onColumnFiltersChange, []
    );

    const [globalFilter, setGlobalFilter] = useTableState<string>(
        globalFilterProp, onGlobalFilterChange, ""
    );

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({

        data,

        columns,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination,
        },

        manualPagination,
        pageCount: manualPagination ? pageCount ?? -1 : undefined,
        manualSorting,
        manualFiltering,

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

    });

    const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map(row => row.original);

    const clearSelection = () => setRowSelection({});

    let bulkActionsBar: ReactNode;

    if (selectedRows.length > 0 && renderBulkActions)
        bulkActionsBar = renderBulkActions(selectedRows, clearSelection);

    return (

        <div className="space-y-4">

            <DataTableToolbar
                table={table}
                searchPlaceholder={searchPlaceholder}
                exportFilename={exportFilename}
                bulkActionsBar={bulkActionsBar}
                filtersSlot={renderFilters?.(table)}
            />

            <div className="rounded-lg border">

                <Table>

                    <TableHeader>

                        {table.getHeaderGroups().map(headerGroup => (

                            <TableRow key={headerGroup.id}>

                                {headerGroup.headers.map(header => (

                                    <TableHead key={header.id}>

                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}

                                    </TableHead>

                                ))}

                            </TableRow>

                        ))}

                    </TableHeader>

                    <TableBody>

                        {table.getRowModel().rows.length ? (

                            table.getRowModel().rows.map(row => (

                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                >

                                    {row.getVisibleCells().map(cell => (

                                        <TableCell key={cell.id}>

                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}

                                        </TableCell>

                                    ))}

                                </TableRow>

                            ))

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results.
                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>

            </div>

            <DataTablePagination table={table} />

        </div>

    );

}
