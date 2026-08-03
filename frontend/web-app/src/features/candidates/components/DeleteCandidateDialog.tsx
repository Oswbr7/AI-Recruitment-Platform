import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onConfirm: () => void;

    isLoading?: boolean;

    count?: number;

    name?: string;

}

export function DeleteCandidateDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    count = 1,
    name,
}: Props) {

    return (

        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title={count > 1 ? `Delete ${count} candidates` : "Delete candidate"}
            description={
                name
                    ? `Are you sure you want to delete "${name}"? This action cannot be undone.`
                    : `Are you sure you want to delete ${count} candidate${count > 1 ? "s" : ""}? This action cannot be undone.`
            }
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />

    );

}
