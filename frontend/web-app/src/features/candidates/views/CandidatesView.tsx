import { useEffect, useState } from "react";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

import { DataTableSkeleton } from "@/shared/components/data-table/DataTableSkeleton";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useCandidates } from "../hooks/useCandidates";
import { CandidateToolbar } from "../components/toolbar/CandidateToolbar";
import { CandidateTable } from "../components/table/CandidateTable";
import { CandidateSheet } from "../components/sheet";

const sortByColumnId: Record<string, string> = {
    firstName: "firstname",
    lastName: "lastname",
    email: "email",
    stage: "stage",
};

export function CandidatesView() {

    const [open, setOpen] = useState(false);

    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {

        const timer = setTimeout(() => setDebouncedSearch(globalFilter), 300);

        return () => clearTimeout(timer);

    }, [globalFilter]);

    useEffect(() => {

        setPagination(prev => ({ ...prev, pageIndex: 0 }));

    }, [debouncedSearch, columnFilters]);

    const sortColumn = sorting[0];

    const stageFilter = (columnFilters.find(filter => filter.id === "stage")?.value as string[] | undefined)?.[0];

    const statusFilter = (columnFilters.find(filter => filter.id === "status")?.value as string[] | undefined)?.[0];

    const { data, isLoading, isError } = useCandidates({

        page: pagination.pageIndex + 1,

        pageSize: pagination.pageSize,

        search: debouncedSearch || undefined,

        stage: stageFilter,

        status: statusFilter,

        sortBy: sortColumn ? sortByColumnId[sortColumn.id] : undefined,

        sortDirection: sortColumn ? (sortColumn.desc ? "desc" : "asc") : undefined,

    });

    const hasNoFilters = !debouncedSearch && !stageFilter && !statusFilter;

    return (

        <div className="space-y-8">

            <CandidateToolbar
                onCreateCandidate={() => setOpen(true)}
            />

            {isLoading ? (

                <DataTableSkeleton columns={7} />

            ) : isError ? (

                <div className="flex flex-col items-center py-20 text-center">

                    <h3 className="text-xl font-semibold">Unable to load candidates</h3>

                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>

                </div>

            ) : hasNoFilters && (data?.totalCount ?? 0) === 0 ? (

                <EmptyState
                    title="No candidates"
                    description="Add your first candidate to get started."
                />

            ) : (

                <CandidateTable
                    candidates={data?.items ?? []}
                    pageCount={data?.totalPages ?? 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    columnFilters={columnFilters}
                    onColumnFiltersChange={setColumnFilters}
                />

            )}

            <CandidateSheet
                open={open}
                onOpenChange={setOpen}
            />

        </div>

    );

}
