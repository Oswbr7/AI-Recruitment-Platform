import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CompanyStatus, type Company } from "../../models/Company";
import { useDeleteCompany } from "../../hooks/useDeleteCompany";
import { useArchiveCompany } from "../../hooks/useArchiveCompany";
import { useRestoreCompany } from "../../hooks/useRestoreCompany";
import { CompanySheet } from "../sheet";
import { DeleteCompanyDialog } from "../DeleteCompanyDialog";

interface Props {

    company: Company;

}

export function CompanyActionsMenu({
    company,
}: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const deleteCompany = useDeleteCompany();
    const archiveCompany = useArchiveCompany();
    const restoreCompany = useRestoreCompany();

    const handleDelete = () => {

        deleteCompany.mutate(company.id, {
            onSuccess: () => setDeleteOpen(false),
        });

    };

    return (

        <>

            <DropdownMenu>

                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                    <DropdownMenuItem onClick={() => navigate(`/company/${company.id}`)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {company.status === CompanyStatus.Active ? (

                        <DropdownMenuItem onClick={() => archiveCompany.mutate(company.id)}>
                            <Archive className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Archive
                        </DropdownMenuItem>

                    ) : (

                        <DropdownMenuItem onClick={() => restoreCompany.mutate(company.id)}>
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Restore
                        </DropdownMenuItem>

                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

            <CompanySheet
                company={company}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteCompanyDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                name={company.name}
                isLoading={deleteCompany.isPending}
                onConfirm={handleDelete}
            />

        </>

    );

}
