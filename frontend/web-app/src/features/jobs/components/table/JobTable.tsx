import { useState } from "react";
import { Archive, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { JobStatus, type Job } from "../../models/Job";
import { useArchiveJob } from "../../hooks/useArchiveJob";
import { useDeleteJob } from "../../hooks/useDeleteJob";
import { jobColumns } from "./JobColumns";
import { DeleteJobDialog } from "../DeleteJobDialog";

const statusOptions = Object.values(JobStatus).map(value => ({
    label: value,
    value,
}));

interface Props {

    jobs: Job[];

}

export function JobTable({

    jobs

}: Props) {

    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const [pendingIds, setPendingIds] = useState<string[]>([]);

    const [clearSelectionFn, setClearSelectionFn] = useState<(() => void) | null>(null);

    const archiveJob = useArchiveJob();

    const deleteJob = useDeleteJob();

    if (!jobs.length)

        return (

            <EmptyState

                title="No jobs"

                description="Create your first job posting."

            />

        );

    const handleBulkArchive = async (
        selected: Job[],
        clearSelection: () => void
    ) => {

        await Promise.allSettled(
            selected.map(job => archiveJob.mutateAsync(job.id))
        );

        clearSelection();

    };

    const handleBulkDeleteConfirm = async () => {

        await Promise.allSettled(
            pendingIds.map(id => deleteJob.mutateAsync(id))
        );

        setBulkDeleteOpen(false);

        clearSelectionFn?.();

    };

    return (

        <>

            <DataTable
                columns={jobColumns}
                data={jobs}
                searchPlaceholder="Search jobs..."
                exportFilename="jobs.csv"
                renderFilters={table => (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statusOptions}
                    />
                )}
                renderBulkActions={(selectedRows, clearSelection) => (

                    <div className="flex items-center gap-2">

                        <span className="text-sm text-muted-foreground">
                            {selectedRows.length} selected
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkArchive(selectedRows, clearSelection)}
                        >
                            <Archive className="mr-1.5 h-4 w-4" />
                            Archive
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setPendingIds(selectedRows.map(job => job.id));
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

            <DeleteJobDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                count={pendingIds.length}
                isLoading={deleteJob.isPending}
                onConfirm={handleBulkDeleteConfirm}
            />

        </>

    );

}
