import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import type { CandidateNote } from "../../models/CandidateNote";
import { useUpdateCandidateNote } from "../../hooks/useUpdateCandidateNote";
import { useDeleteCandidateNote } from "../../hooks/useDeleteCandidateNote";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

interface Props {

    candidateId: string;

    note: CandidateNote;

}

export function NoteCard({
    candidateId,
    note,
}: Props) {

    const [editing, setEditing] = useState(false);

    const [content, setContent] = useState(note.content);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const updateNote = useUpdateCandidateNote(candidateId);

    const deleteNote = useDeleteCandidateNote(candidateId);

    const handleSave = () => {

        updateNote.mutate(
            { noteId: note.id, content },
            { onSuccess: () => setEditing(false) }
        );

    };

    const handleCancel = () => {

        setContent(note.content);

        setEditing(false);

    };

    return (

        <Card size="sm">

            <CardContent className="space-y-2">

                {editing ? (

                    <>

                        <Textarea
                            rows={3}
                            value={content}
                            onChange={event => setContent(event.target.value)}
                        />

                        <div className="flex justify-end gap-2">

                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                <X className="mr-1 h-3.5 w-3.5" />
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                disabled={!content.trim() || updateNote.isPending}
                                onClick={handleSave}
                            >
                                <Check className="mr-1 h-3.5 w-3.5" />
                                Save
                            </Button>

                        </div>

                    </>

                ) : (

                    <>

                        <p className="whitespace-pre-wrap text-sm">{note.content}</p>

                        <div className="flex items-center justify-between">

                            <span className="text-xs text-muted-foreground">
                                {note.updatedAt.toLocaleString()}
                            </span>

                            <div className="flex gap-1">

                                <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)}>
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>

                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>

                            </div>

                        </div>

                    </>

                )}

            </CardContent>

            <DeleteNoteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isLoading={deleteNote.isPending}
                onConfirm={() =>
                    deleteNote.mutate(note.id, { onSuccess: () => setDeleteOpen(false) })
                }
            />

        </Card>

    );

}
