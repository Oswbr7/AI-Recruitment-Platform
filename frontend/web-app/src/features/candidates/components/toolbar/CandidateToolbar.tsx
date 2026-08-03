import { useNavigate } from "react-router-dom";
import { KanbanSquare, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CandidateToolbarProps {

    onCreateCandidate: () => void;

}

export function CandidateToolbar({

    onCreateCandidate

}: CandidateToolbarProps) {

    const navigate = useNavigate();

    return (

        <div className="flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">

                    Candidates

                </h1>

                <p className="text-muted-foreground">

                    Manage your candidate pipeline.

                </p>

            </div>

            <div className="flex items-center gap-2">

                <Button

                    variant="outline"

                    onClick={() => navigate("/candidates/pipeline")}

                >

                    <KanbanSquare className="mr-2 h-4 w-4"/>

                    Pipeline

                </Button>

                <Button

                    onClick={onCreateCandidate}

                >

                    <Plus className="mr-2 h-4 w-4"/>

                    Create Candidate

                </Button>

            </div>

        </div>

    );

}
