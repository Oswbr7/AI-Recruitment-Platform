import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onConfirm: () => void;

    isLoading?: boolean;

    count?: number;

    title?: string;

}

export function DeleteInterviewDialog({
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
            title={count > 1 ? `Delete ${count} interviews` : "Delete interview"}
            description={
                title
                    ? `Are you sure you want to delete "${title}"? This action cannot be undone.`
                    : `Are you sure you want to delete ${count} interview${count > 1 ? "s" : ""}? This action cannot be undone.`
            }
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />

    );

}
