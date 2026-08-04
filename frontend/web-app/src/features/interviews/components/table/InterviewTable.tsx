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

import { InterviewStage, InterviewStatus, type Interview } from "../../models/Interview";
import { useDeleteInterview } from "../../hooks/useDeleteInterview";
import { useRecruiters } from "../../hooks/useRecruiters";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { getInterviewColumns } from "./InterviewColumns";
import { DeleteInterviewDialog } from "../DeleteInterviewDialog";

const statusOptions = Object.values(InterviewStatus).map(value => ({
    label: value,
    value,
}));

const stageOptions = Object.values(InterviewStage).map(value => ({
    label: value,
    value,
}));

interface Props {

    interviews: Interview[];

    pageCount: number;

    pagination: PaginationState;

    onPaginationChange: OnChangeFn<PaginationState>;

    sorting: SortingState;

    onSortingChange: OnChangeFn<SortingState>;

    globalFilter: string;

    onGlobalFilterChange: OnChangeFn<string>;

    columnFilters: ColumnFiltersState;

    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

    dateFrom: string;

    onDateFromChange: (value: string) => void;

    dateTo: string;

    onDateToChange: (value: string) => void;

}

export function InterviewTable({

    interviews,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,

}: Props) {

    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const [pendingIds, setPendingIds] = useState<string[]>([]);

    const [clearSelectionFn, setClearSelectionFn] = useState<(() => void) | null>(null);

    const deleteInterview = useDeleteInterview();

    const { data: candidatesData } = useCandidates({ pageSize: 200 });

    const { data: jobs } = useJobs();

    const { data: recruiters } = useRecruiters();

    const recruiterOptions = useMemo(
        () => (recruiters ?? []).map(r => ({ label: `${r.firstName} ${r.lastName}`, value: r.id })),
        [recruiters]
    );

    const candidateNameById = useMemo(() => {

        const map: Record<string, string> = {};

        for (const candidate of candidatesData?.items ?? [])
            map[candidate.id] = `${candidate.firstName} ${candidate.lastName}`;

        return map;

    }, [candidatesData]);

    const jobTitleById = useMemo(() => {

        const map: Record<string, string> = {};

        for (const job of jobs ?? [])
            map[job.id] = job.title;

        return map;

    }, [jobs]);

    const recruiterNameById = useMemo(() => {

        const map: Record<string, string> = {};

        for (const recruiter of recruiters ?? [])
            map[recruiter.id] = `${recruiter.firstName} ${recruiter.lastName}`;

        return map;

    }, [recruiters]);

    const columns = useMemo(
        () => getInterviewColumns(candidateNameById, jobTitleById, recruiterNameById),
        [candidateNameById, jobTitleById, recruiterNameById]
    );

    const handleBulkDeleteConfirm = async () => {

        await Promise.allSettled(
            pendingIds.map(id => deleteInterview.mutateAsync(id))
        );

        setBulkDeleteOpen(false);

        clearSelectionFn?.();

    };

    return (

        <>

            <DataTable
                columns={columns}
                data={interviews}
                searchPlaceholder="Search interviews..."
                exportFilename="interviews.csv"
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
                            column={table.getColumn("status")}
                            title="Status"
                            options={statusOptions}
                        />

                        <DataTableFacetedFilter
                            column={table.getColumn("interviewStage")}
                            title="Stage"
                            options={stageOptions}
                        />

                        <DataTableFacetedFilter
                            column={table.getColumn("recruiter")}
                            title="Recruiter"
                            options={recruiterOptions}
                        />

                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={event => onDateFromChange(event.target.value)}
                            className="h-7 w-36"
                        />

                        <Input
                            type="date"
                            value={dateTo}
                            onChange={event => onDateToChange(event.target.value)}
                            className="h-7 w-36"
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
                                setPendingIds(selectedRows.map(interview => interview.id));
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

            <DeleteInterviewDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                count={pendingIds.length}
                isLoading={deleteInterview.isPending}
                onConfirm={handleBulkDeleteConfirm}
            />

        </>

    );

}
