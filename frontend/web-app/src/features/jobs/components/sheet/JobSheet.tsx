import {
    EntitySheet,
    EntitySheetHeader,
} from "@/shared/components/entity";

import { JobForm } from "../form";
import { useCreateJob } from "../../hooks/useCreateJob";
import { useUpdateJob } from "../../hooks/useUpdateJob";
import { toJobFormValues } from "../../api/mappers/jobFormMapper";
import type { Job } from "../../models/Job";

interface JobSheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    job?: Job;

}

export function JobSheet({

    open,

    onOpenChange,

    job,

}: JobSheetProps) {

    const createMutation = useCreateJob();

    const updateMutation = useUpdateJob(job?.id ?? "");

    const isEditing = Boolean(job);

    const isSubmitting = isEditing
        ? updateMutation.isPending
        : createMutation.isPending;

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader

                title={isEditing ? "Edit Job" : "Create Job"}

                description={
                    isEditing
                        ? "Update this job posting."
                        : "Create a new job posting."
                }

            />

            <JobForm

                initialValues={job ? toJobFormValues(job) : undefined}

                isSubmitting={isSubmitting}

                onCancel={() => onOpenChange(false)}

                onSubmit={async values => {

                    if (isEditing)
                        await updateMutation.mutateAsync(values);
                    else
                        await createMutation.mutateAsync(values);

                    onOpenChange(false);

                }}

            />

        </EntitySheet>

    );

}
