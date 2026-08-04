import {
    EntitySheet,
    EntitySheetHeader,
} from "@/shared/components/entity";

import { InterviewForm } from "../form";
import { useScheduleInterview } from "../../hooks/useScheduleInterview";
import { useUpdateInterview } from "../../hooks/useUpdateInterview";
import { toInterviewFormValues } from "../../api/mappers/interviewFormMapper";
import type { Interview } from "../../models/Interview";

interface InterviewSheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    interview?: Interview;

}

export function InterviewSheet({

    open,

    onOpenChange,

    interview,

}: InterviewSheetProps) {

    const scheduleMutation = useScheduleInterview();

    const updateMutation = useUpdateInterview(interview?.id ?? "");

    const isEditing = Boolean(interview);

    const isSubmitting = isEditing
        ? updateMutation.isPending
        : scheduleMutation.isPending;

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader

                title={isEditing ? "Edit Interview" : "Schedule Interview"}

                description={
                    isEditing
                        ? "Update this interview's details."
                        : "Schedule a new interview."
                }

            />

            <InterviewForm

                initialValues={interview ? toInterviewFormValues(interview) : undefined}

                isSubmitting={isSubmitting}

                onCancel={() => onOpenChange(false)}

                onSubmit={async values => {

                    if (isEditing)
                        await updateMutation.mutateAsync(values);
                    else
                        await scheduleMutation.mutateAsync(values);

                    onOpenChange(false);

                }}

            />

        </EntitySheet>

    );

}
