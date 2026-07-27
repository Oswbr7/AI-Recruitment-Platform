import type { ReactNode } from "react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

interface EntitySheetProps {

    open: boolean;

    onOpenChange: (open: boolean) => void;

    children: ReactNode;

}

export function EntitySheet({

    open,

    onOpenChange,

    children

}: EntitySheetProps) {

    return (

        <Sheet

            open={open}

            onOpenChange={onOpenChange}

        >

            <SheetContent

                side="right"

                className="w-full sm:max-w-2xl overflow-y-auto p-0"

            >

                {children}

            </SheetContent>

        </Sheet>

    );

}