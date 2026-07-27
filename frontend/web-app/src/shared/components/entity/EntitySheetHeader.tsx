import type { ReactNode } from "react";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

interface Props {

    title: string;

    description?: string;

    children?: ReactNode;

}

export function EntitySheetHeader({

    title,

    description,

    children

}: Props) {

    return (

        <SheetHeader className="border-b px-6 py-5">

            <SheetTitle>

                {title}

            </SheetTitle>

            {description && (

                <SheetDescription>

                    {description}

                </SheetDescription>

            )}

            {children}

        </SheetHeader>

    );

}