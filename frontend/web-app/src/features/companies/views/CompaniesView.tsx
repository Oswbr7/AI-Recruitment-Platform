import { useEffect, useState } from "react";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

import { DataTableSkeleton } from "@/shared/components/data-table/DataTableSkeleton";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useCompanies } from "../hooks/useCompanies";
import { CompanyToolbar } from "../components/toolbar/CompanyToolbar";
import { CompanyTable } from "../components/table/CompanyTable";
import { CompanySheet } from "../components/sheet";

const sortByColumnId: Record<string, string> = {
    name: "name",
    industry: "industry",
    country: "country",
    updatedAt: "updatedat",
};

export function CompaniesView() {

    const [open, setOpen] = useState(false);

    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [countryFilter, setCountryFilter] = useState("");

    const [debouncedCountry, setDebouncedCountry] = useState("");

    useEffect(() => {

        const timer = setTimeout(() => setDebouncedSearch(globalFilter), 300);

        return () => clearTimeout(timer);

    }, [globalFilter]);

    useEffect(() => {

        const timer = setTimeout(() => setDebouncedCountry(countryFilter), 300);

        return () => clearTimeout(timer);

    }, [countryFilter]);

    useEffect(() => {

        setPagination(prev => ({ ...prev, pageIndex: 0 }));

    }, [debouncedSearch, columnFilters, debouncedCountry]);

    const sortColumn = sorting[0];

    const industryFilter = (columnFilters.find(filter => filter.id === "industry")?.value as string[] | undefined)?.[0];

    const statusFilter = (columnFilters.find(filter => filter.id === "status")?.value as string[] | undefined)?.[0];

    const { data, isLoading, isError } = useCompanies({

        page: pagination.pageIndex + 1,

        pageSize: pagination.pageSize,

        search: debouncedSearch || undefined,

        industry: industryFilter,

        status: statusFilter,

        country: debouncedCountry || undefined,

        sortBy: sortColumn ? sortByColumnId[sortColumn.id] : undefined,

        sortDirection: sortColumn ? (sortColumn.desc ? "desc" : "asc") : undefined,

    });

    const hasNoFilters = !debouncedSearch && !industryFilter && !statusFilter && !debouncedCountry;

    return (

        <div className="space-y-8">

            <CompanyToolbar
                onCreateCompany={() => setOpen(true)}
            />

            {isLoading ? (

                <DataTableSkeleton columns={8} />

            ) : isError ? (

                <div className="flex flex-col items-center py-20 text-center">

                    <h3 className="text-xl font-semibold">Unable to load companies</h3>

                    <p className="text-muted-foreground">Something went wrong. Please try again.</p>

                </div>

            ) : hasNoFilters && (data?.totalCount ?? 0) === 0 ? (

                <EmptyState
                    title="No companies"
                    description="Add your first company to get started."
                />

            ) : (

                <CompanyTable
                    companies={data?.items ?? []}
                    pageCount={data?.totalPages ?? 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    columnFilters={columnFilters}
                    onColumnFiltersChange={setColumnFilters}
                    countryFilter={countryFilter}
                    onCountryFilterChange={setCountryFilter}
                />

            )}

            <CompanySheet
                open={open}
                onOpenChange={setOpen}
            />

        </div>

    );

}
