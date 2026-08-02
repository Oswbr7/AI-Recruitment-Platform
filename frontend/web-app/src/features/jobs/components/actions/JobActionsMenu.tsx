import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Archive,
    Copy,
    Eye,
    MoreHorizontal,
    Pencil,
    PlayCircle,
    StopCircle,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { JobStatus, type Job } from "../../models/Job";
import { usePublishJob } from "../../hooks/usePublishJob";
import { useCloseJob } from "../../hooks/useCloseJob";
import { useArchiveJob } from "../../hooks/useArchiveJob";
import { useReopenJob } from "../../hooks/useReopenJob";
import { useDuplicateJob } from "../../hooks/useDuplicateJob";
import { useDeleteJob } from "../../hooks/useDeleteJob";
import { JobSheet } from "../sheet";
import { DeleteJobDialog } from "../DeleteJobDialog";

interface Props {

    job: Job;

}

export function JobActionsMenu({
    job,
}: Props) {

    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const publishJob = usePublishJob();
    const closeJob = useCloseJob();
    const archiveJob = useArchiveJob();
    const reopenJob = useReopenJob();
    const duplicateJob = useDuplicateJob();
    const deleteJob = useDeleteJob();

    const handleDelete = () => {

        deleteJob.mutate(job.id, {
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

                    <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {job.status === JobStatus.Draft && (
                        <DropdownMenuItem onClick={() => publishJob.mutate(job.id)}>
                            <PlayCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Publish
                        </DropdownMenuItem>
                    )}

                    {(job.status === JobStatus.Closed || job.status === JobStatus.Archived) && (
                        <DropdownMenuItem onClick={() => reopenJob.mutate(job.id)}>
                            <PlayCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Reopen
                        </DropdownMenuItem>
                    )}

                    {job.status === JobStatus.Published && (
                        <DropdownMenuItem onClick={() => closeJob.mutate(job.id)}>
                            <StopCircle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Close
                        </DropdownMenuItem>
                    )}

                    {job.status !== JobStatus.Archived && (
                        <DropdownMenuItem onClick={() => archiveJob.mutate(job.id)}>
                            <Archive className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            Archive
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => duplicateJob.mutate(job.id)}>
                        <Copy className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Duplicate
                    </DropdownMenuItem>

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

            <JobSheet
                job={job}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteJobDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={job.title}
                isLoading={deleteJob.isPending}
                onConfirm={handleDelete}
            />

        </>

    );

}
