import { DataTable } from "@/shared/components/data-table/DataTable";

import { jobColumns } from "../table/jobColumns";

import { useJobs } from "../hooks/useJobs";

export function JobsPage() {

    const {

        data,

        isLoading,

    } = useJobs();

    if (isLoading)

        return <div>Loading...</div>;

    return (

        <div className="space-y-6">

            <h1 className="text-3xl font-bold">

                Jobs

            </h1>

            <DataTable

                columns={jobColumns}

                data={data ?? []}

            />

        </div>

    );

}