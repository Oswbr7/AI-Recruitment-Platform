import {
    EntitySheet,
    EntitySheetHeader,
} from "@/shared/components/entity";

import { CandidateForm } from "../form";
import { useCreateCandidate } from "../../hooks/useCreateCandidate";
import { useUpdateCandidate } from "../../hooks/useUpdateCandidate";
import { toCandidateFormValues } from "../../api/mappers/candidateFormMapper";
import type { Candidate } from "../../models/Candidate";

interface CandidateSheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    candidate?: Candidate;

}

export function CandidateSheet({

    open,

    onOpenChange,

    candidate,

}: CandidateSheetProps) {

    const createMutation = useCreateCandidate();

    const updateMutation = useUpdateCandidate(candidate?.id ?? "");

    const isEditing = Boolean(candidate);

    const isSubmitting = isEditing
        ? updateMutation.isPending
        : createMutation.isPending;

    return (

        <EntitySheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <EntitySheetHeader

                title={isEditing ? "Edit Candidate" : "Create Candidate"}

                description={
                    isEditing
                        ? "Update this candidate's profile."
                        : "Add a new candidate to the pipeline."
                }

            />

            <CandidateForm

                initialValues={candidate ? toCandidateFormValues(candidate) : undefined}

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
