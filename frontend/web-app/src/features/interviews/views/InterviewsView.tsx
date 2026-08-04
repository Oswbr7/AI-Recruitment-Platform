import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

import { DataTableSkeleton } from "@/shared/components/data-table/DataTableSkeleton";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useInterviews } from "../hooks/useInterviews";
import { InterviewToolbar } from "../components/toolbar/InterviewToolbar";
import { InterviewTable } from "../components/table/InterviewTable";
import { InterviewSheet } from "../components/sheet";

const sortByColumnId: Record<string, string> = {
    scheduledAt: "scheduledat",
    status: "status",
    interviewStage: "stage",
};

export function InterviewsView() {

    const [open, setOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {

        if ((location.state as { openCreate?: boolean } | null)?.openCreate)
            setOpen(true);

    }, [location.state]);

    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    useEffect(() => {

        const timer = setTimeout(() => setDebouncedSearch(globalFilter), 300);

        return () => clearTimeout(timer);

    }, [globalFilter]);

    useEffect(() => {

        setPagination(prev => ({ ...prev, pageIndex: 0 }));

    }, [debouncedSearch, columnFilters, dateFrom, dateTo]);

    const sortColumn = sorting[0];

    const statusFilter = (columnFilters.find(filter => filter.id === "status")?.value as string[] | undefined)?.[0];

    const stageFilter = (columnFilters.find(filter => filter.id === "interviewStage")?.value as string[] | undefined)?.[0];

    const recruiterFilter = (columnFilters.find(filter => filter.id === "recruiter")?.value as string[] | undefined)?.[0];

    const { data, isLoading, isError } = useInterviews({

        page: pagination.pageIndex + 1,

        pageSize: pagination.pageSize,

        search: debouncedSearch || undefined,

        status: statusFilter,

        stage: stageFilter,

        recruiterId: recruiterFilter,

        dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,

        dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,

        sortBy: sortColumn ? sortByColumnId[sortColumn.id] : undefined,

        sortDirection: sortColumn ? (sortColumn.desc ? "desc" : "asc") : undefined,

    });

    const hasNoFilters = !debouncedSearch && !statusFilter && !stageFilter && !recruiterFilter && !dateFrom && !dateTo;

    return (

        <div className="space-y-8">

            <InterviewToolbar
                onScheduleInterview={() => setOpen(true)}
            />

            {isLoading ? (

                <DataTableSkeleton columns={8} />

            ) : isError ? (

                <div className="flex flex-col items-center py-20 text-center">

                    <h3 className="text-xl font-semibold">Unable to load interviews</h3>

                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>

                </div>

            ) : hasNoFilters && (data?.totalCount ?? 0) === 0 ? (

                <EmptyState
                    title="No interviews"
                    description="Schedule your first interview to get started."
                />

            ) : (

                <InterviewTable
                    interviews={data?.items ?? []}
                    pageCount={data?.totalPages ?? 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    columnFilters={columnFilters}
                    onColumnFiltersChange={setColumnFilters}
                    dateFrom={dateFrom}
                    onDateFromChange={setDateFrom}
                    dateTo={dateTo}
                    onDateToChange={setDateTo}
                />

            )}

            <InterviewSheet
                open={open}
                onOpenChange={setOpen}
            />

        </div>

    );

}
