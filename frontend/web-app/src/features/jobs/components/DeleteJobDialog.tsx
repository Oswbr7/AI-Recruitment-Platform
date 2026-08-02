import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onConfirm: () => void;

    isLoading?: boolean;

    count?: number;

    title?: string;

}

export function DeleteJobDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    count = 1,
    title,
}: Props) {

    return (

        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title={count > 1 ? `Delete ${count} jobs` : "Delete job posting"}
            description={
                title
                    ? `Are you sure you want to delete "${title}"? This action cannot be undone.`
                    : `Are you sure you want to delete ${count} job posting${count > 1 ? "s" : ""}? This action cannot be undone.`
            }
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />

    );

}
