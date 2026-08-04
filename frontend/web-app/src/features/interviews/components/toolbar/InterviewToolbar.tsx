import { useNavigate } from "react-router-dom";
import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface InterviewToolbarProps {

    onScheduleInterview: () => void;

}

export function InterviewToolbar({

    onScheduleInterview

}: InterviewToolbarProps) {

    const navigate = useNavigate();

    return (

        <div className="flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">

                    Interviews

                </h1>

                <p className="text-muted-foreground">

                    Manage scheduled interviews.

                </p>

            </div>

            <div className="flex items-center gap-2">

                <Button

                    variant="outline"

                    onClick={() => navigate("/interviews/calendar")}

                >

                    <CalendarDays className="mr-2 h-4 w-4"/>

                    Calendar

                </Button>

                <Button

                    onClick={onScheduleInterview}

                >

                    <Plus className="mr-2 h-4 w-4"/>

                    Schedule Interview

                </Button>

            </div>

        </div>

    );

}
