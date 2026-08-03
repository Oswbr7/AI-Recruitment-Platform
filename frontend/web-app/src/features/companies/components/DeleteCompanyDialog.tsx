import { ConfirmDialog } from "@/shared/components/dialogs/ConfirmDialog";

interface Props {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    onConfirm: () => void;

    isLoading?: boolean;

    count?: number;

    name?: string;

}

export function DeleteCompanyDialog({
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
            title={count > 1 ? `Delete ${count} companies` : "Delete company"}
            description={
                name
                    ? `Are you sure you want to delete "${name}"? This action cannot be undone.`
                    : `Are you sure you want to delete ${count} compan${count > 1 ? "ies" : "y"}? This action cannot be undone.`
            }
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />

    );

}
