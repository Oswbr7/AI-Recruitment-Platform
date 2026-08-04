import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, CheckCircle2, Eye, MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { InterviewStatus, type Interview } from "../../models/Interview";
import { useDeleteInterview } from "../../hooks/useDeleteInterview";
import { useCancelInterview } from "../../hooks/useCancelInterview";
import { useCompleteInterview } from "../../hooks/useCompleteInterview";
import { InterviewSheet } from "../sheet";
import { RescheduleSheet } from "../reschedule/RescheduleSheet";
import { DeleteInterviewDialog } from "../DeleteInterviewDialog";

interface Props {

    interview: Interview;

}

export function InterviewActionsMenu({
    interview,
}: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const [rescheduleOpen, setRescheduleOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const deleteInterview = useDeleteInterview();
    const cancelInterview = useCancelInterview();
    const completeInterview = useCompleteInterview();

    const isScheduled = interview.status === InterviewStatus.Scheduled;

    const handleDelete = () => {

        deleteInterview.mutate(interview.id, {
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

                    <DropdownMenuItem onClick={() => navigate(`/interviews/${interview.id}`)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Edit
                    </DropdownMenuItem>

                    {isScheduled && (

                        <>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => setRescheduleOpen(true)}>
                                <CalendarClock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                Reschedule
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => completeInterview.mutate(interview.id)}>
                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                Complete
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => cancelInterview.mutate(interview.id)}>
                                <XCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                                Cancel
                            </DropdownMenuItem>

                        </>

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

            <InterviewSheet
                interview={interview}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            {isScheduled && (

                <RescheduleSheet
                    interview={interview}
                    open={rescheduleOpen}
                    onOpenChange={setRescheduleOpen}
                />

            )}

            <DeleteInterviewDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={interview.title}
                isLoading={deleteInterview.isPending}
                onConfirm={handleDelete}
            />

        </>

    );

}
