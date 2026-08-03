import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CompanyToolbarProps {

    onCreateCompany: () => void;

}

export function CompanyToolbar({

    onCreateCompany

}: CompanyToolbarProps) {

    return (

        <div className="flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">

                    Companies

                </h1>

                <p className="text-muted-foreground">

                    Manage the companies on your platform.

                </p>

            </div>

            <Button

                onClick={onCreateCompany}

            >

                <Plus className="mr-2 h-4 w-4"/>

                Create Company

            </Button>

        </div>

    );

}
