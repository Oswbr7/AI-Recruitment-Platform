import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useCandidateNotes } from "../../hooks/useCandidateNotes";
import { useAddCandidateNote } from "../../hooks/useAddCandidateNote";
import { NoteCard } from "./NoteCard";

interface Props {

    candidateId: string;

}

export function CandidateNotesSection({
    candidateId,
}: Props) {

    const [content, setContent] = useState("");

    const { data: notes, isLoading } = useCandidateNotes(candidateId);

    const addNote = useAddCandidateNote(candidateId);

    const handleAdd = () => {

        if (!content.trim())
            return;

        addNote.mutate(content.trim(), {
            onSuccess: () => setContent(""),
        });

    };

    return (

        <Card>

            <CardHeader>
                <CardTitle>Notes</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                <div className="space-y-2">

                    <Textarea
                        rows={3}
                        placeholder="Add a note about this candidate..."
                        value={content}
                        onChange={event => setContent(event.target.value)}
                    />

                    <div className="flex justify-end">

                        <Button
                            size="sm"
                            disabled={!content.trim() || addNote.isPending}
                            onClick={handleAdd}
                        >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            Add Note
                        </Button>

                    </div>

                </div>

                {isLoading ? null : !notes?.length ? (

                    <EmptyState
                        title="No notes yet"
                        description="Add the first note about this candidate."
                    />

                ) : (

                    <div className="space-y-3">

                        {notes.map(note => (
                            <NoteCard key={note.id} candidateId={candidateId} note={note} />
                        ))}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}
