import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onConfirm: () => void;

    isLoading?: boolean;

}

export function DeleteContactDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: Props) {

    return (

        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete contact"
            description="Are you sure you want to delete this contact? This action cannot be undone."
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />

    );

}
