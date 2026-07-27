import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface JobToolbarProps {

    onCreateJob: () => void;

}

export function JobToolbar({

    onCreateJob

}: JobToolbarProps) {

    return (

        <div className="flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">

                    Jobs

                </h1>

                <p className="text-muted-foreground">

                    Manage your job openings.

                </p>

            </div>

            <Button

                onClick={onCreateJob}

            >

                <Plus className="mr-2 h-4 w-4"/>

                Create Job

            </Button>

        </div>

    );

}