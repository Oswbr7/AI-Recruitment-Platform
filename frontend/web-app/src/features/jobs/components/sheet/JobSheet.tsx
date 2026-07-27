import {
    EntitySheet,
    EntitySheetHeader,
} from "@/shared/components/entity";

import { JobForm } from "../form";

import { JobFormValues } from "../../schemas/jobSchema";

interface JobSheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onSubmit: (values: JobFormValues) => void | Promise<void>;

    isSubmitting?: boolean;

}

export function JobSheet({

    open,

    onOpenChange,

    onSubmit,

    isSubmitting = false

}: JobSheetProps) {

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader

                title="Create Job"

                description="Create a new job posting."

            />

            <JobForm

                onSubmit={onSubmit}

                onCancel={() => onOpenChange(false)}

                isSubmitting={isSubmitting}

            />

        </EntitySheet>

    );

}