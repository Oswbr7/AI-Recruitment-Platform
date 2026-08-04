import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useJobs } from "../hooks/useJobs";

import { JobToolbar } from "../components/toolbar/JobToolbar";
import { JobTable } from "../components/table/JobTable";
import { JobSheet } from "../components/sheet";
import { DataTableSkeleton } from "@/shared/components/data-table/DataTableSkeleton";

export function JobsView() {

    const [open, setOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {

        if ((location.state as { openCreate?: boolean } | null)?.openCreate)
            setOpen(true);

    }, [location.state]);

    const { data: jobs, isLoading } = useJobs();

    return (

        <div className="space-y-8">

            <JobToolbar
                onCreateJob={() => setOpen(true)}
            />

            {isLoading ? (

                <DataTableSkeleton columns={6} />

            ) : (

                <JobTable
                    jobs={jobs ?? []}
                />

            )}

            <JobSheet
                open={open}
                onOpenChange={setOpen}
            />

        </div>

    );

}
