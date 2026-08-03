import { useState } from "react";
import { Trash2 } from "lucide-react";
import type {
    ColumnFiltersState,
    OnChangeFn,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";

import { CandidateStage, CandidateStatus, type Candidate } from "../../models/Candidate";
import { useDeleteCandidate } from "../../hooks/useDeleteCandidate";
import { candidateColumns } from "./CandidateColumns";
import { DeleteCandidateDialog } from "../DeleteCandidateDialog";

const stageOptions = Object.values(CandidateStage).map(value => ({
    label: value,
    value,
}));

const statusOptions = Object.values(CandidateStatus).map(value => ({
    label: value,
    value,
}));

interface Props {

    candidates: Candidate[];

    pageCount: number;

    pagination: PaginationState;

    onPaginationChange: OnChangeFn<PaginationState>;

    sorting: SortingState;

    onSortingChange: OnChangeFn<SortingState>;

    globalFilter: string;

    onGlobalFilterChange: OnChangeFn<string>;

    columnFilters: ColumnFiltersState;

    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

}

export function CandidateTable({

    candidates,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,

}: Props) {

    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const [pendingIds, setPendingIds] = useState<string[]>([]);

    const [clearSelectionFn, setClearSelectionFn] = useState<(() => void) | null>(null);

    const deleteCandidate = useDeleteCandidate();

    const handleBulkDeleteConfirm = async () => {

        await Promise.allSettled(
            pendingIds.map(id => deleteCandidate.mutateAsync(id))
        );

        setBulkDeleteOpen(false);

        clearSelectionFn?.();

    };

    return (

        <>

            <DataTable
                columns={candidateColumns}
                data={candidates}
                searchPlaceholder="Search candidates..."
                exportFilename="candidates.csv"
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
                            column={table.getColumn("stage")}
                            title="Stage"
                            options={stageOptions}
                        />

                        <DataTableFacetedFilter
                            column={table.getColumn("status")}
                            title="Status"
                            options={statusOptions}
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
                                setPendingIds(selectedRows.map(candidate => candidate.id));
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

            <DeleteCandidateDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                count={pendingIds.length}
                isLoading={deleteCandidate.isPending}
                onConfirm={handleBulkDeleteConfirm}
            />

        </>

    );

}
