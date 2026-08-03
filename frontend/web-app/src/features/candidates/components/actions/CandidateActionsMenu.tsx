import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, ArrowRightLeft, Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CandidateStage, CandidateStatus, type Candidate } from "../../models/Candidate";
import { useDeleteCandidate } from "../../hooks/useDeleteCandidate";
import { useMoveCandidateStage } from "../../hooks/useMoveCandidateStage";
import { useArchiveCandidate } from "../../hooks/useArchiveCandidate";
import { useRestoreCandidate } from "../../hooks/useRestoreCandidate";
import { CandidateSheet } from "../sheet";
import { DeleteCandidateDialog } from "../DeleteCandidateDialog";

const stageOptions = Object.values(CandidateStage);

interface Props {

    candidate: Candidate;

}

export function CandidateActionsMenu({
    candidate,
}: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const deleteCandidate = useDeleteCandidate();
    const moveStage = useMoveCandidateStage();
    const archiveCandidate = useArchiveCandidate();
    const restoreCandidate = useRestoreCandidate();

    const handleDelete = () => {

        deleteCandidate.mutate(candidate.id, {
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

                    <DropdownMenuItem onClick={() => navigate(`/candidates/${candidate.id}`)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {candidate.status === CandidateStatus.Active && (

                        <DropdownMenuSub>

                            <DropdownMenuSubTrigger>
                                <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                Move to stage
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent>

                                {stageOptions
                                    .filter(stage => stage !== candidate.stage)
                                    .map(stage => (

                                        <DropdownMenuItem
                                            key={stage}
                                            onClick={() => moveStage.mutate({ id: candidate.id, stage })}
                                        >
                                            {stage}
                                        </DropdownMenuItem>

                                    ))}

                            </DropdownMenuSubContent>

                        </DropdownMenuSub>

                    )}

                    {candidate.status === CandidateStatus.Active ? (

                        <DropdownMenuItem onClick={() => archiveCandidate.mutate(candidate.id)}>
                            <Archive className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Archive
                        </DropdownMenuItem>

                    ) : (

                        <DropdownMenuItem onClick={() => restoreCandidate.mutate(candidate.id)}>
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

            <CandidateSheet
                candidate={candidate}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteCandidateDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                name={`${candidate.firstName} ${candidate.lastName}`}
                isLoading={deleteCandidate.isPending}
                onConfirm={handleDelete}
            />

        </>

    );

}
