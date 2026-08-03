import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import type {
    ColumnFiltersState,
    OnChangeFn,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";

import { CompanyStatus, Industry, type Company } from "../../models/Company";
import { useDeleteCompany } from "../../hooks/useDeleteCompany";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { getCompanyColumns } from "./CompanyColumns";
import { DeleteCompanyDialog } from "../DeleteCompanyDialog";

const industryOptions = Object.values(Industry).map(value => ({
    label: value,
    value,
}));

const statusOptions = Object.values(CompanyStatus).map(value => ({
    label: value,
    value,
}));

interface Props {

    companies: Company[];

    pageCount: number;

    pagination: PaginationState;

    onPaginationChange: OnChangeFn<PaginationState>;

    sorting: SortingState;

    onSortingChange: OnChangeFn<SortingState>;

    globalFilter: string;

    onGlobalFilterChange: OnChangeFn<string>;

    columnFilters: ColumnFiltersState;

    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

    countryFilter: string;

    onCountryFilterChange: (country: string) => void;

}

export function CompanyTable({

    companies,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    countryFilter,
    onCountryFilterChange,

}: Props) {

    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const [pendingIds, setPendingIds] = useState<string[]>([]);

    const [clearSelectionFn, setClearSelectionFn] = useState<(() => void) | null>(null);

    const deleteCompany = useDeleteCompany();

    const { data: jobs } = useJobs();

    const openJobsCountByCompany = useMemo(() => {

        const counts: Record<string, number> = {};

        for (const job of jobs ?? []) {

            if (!job.companyId)
                continue;

            counts[job.companyId] = (counts[job.companyId] ?? 0) + 1;

        }

        return counts;

    }, [jobs]);

    const columns = useMemo(
        () => getCompanyColumns(openJobsCountByCompany),
        [openJobsCountByCompany]
    );

    const handleBulkDeleteConfirm = async () => {

        await Promise.allSettled(
            pendingIds.map(id => deleteCompany.mutateAsync(id))
        );

        setBulkDeleteOpen(false);

        clearSelectionFn?.();

    };

    return (

        <>

            <DataTable
                columns={columns}
                data={companies}
                searchPlaceholder="Search companies..."
                exportFilename="companies.csv"
                manualPagination
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                manualSorting
                sorting={sorting}
                onSortingChange={onSortingChange}
                manualFiltering
                globalFilter={globalFilter}
                onGlobalFilterChange={onGlobalFilterChange}
                columnFilters={columnFilters}
                onColumnFiltersChange={onColumnFiltersChange}
                renderFilters={table => (

                    <>

                        <DataTableFacetedFilter
                            column={table.getColumn("industry")}
                            title="Industry"
                            options={industryOptions}
                        />

                        <DataTableFacetedFilter
                            column={table.getColumn("status")}
                            title="Status"
                            options={statusOptions}
                        />

                        <Input
                            placeholder="Country..."
                            value={countryFilter}
                            onChange={event => onCountryFilterChange(event.target.value)}
                            className="h-7 w-32"
                        />

                    </>

                )}
                renderBulkActions={(selectedRows, clearSelection) => (

                    <div className="flex items-center gap-2">

                        <span className="text-sm text-muted-foreground">
                            {selectedRows.length} selected
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setPendingIds(selectedRows.map(company => company.id));
                                setClearSelectionFn(() => clearSelection);
                                setBulkDeleteOpen(true);
                            }}
                        >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete
                        </Button>

                    </div>

                )}
            />

            <DeleteCompanyDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                count={pendingIds.length}
                isLoading={deleteCompany.isPending}
                onConfirm={handleBulkDeleteConfirm}
            />

        </>

    );

}
