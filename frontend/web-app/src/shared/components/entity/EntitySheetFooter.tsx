import type { ReactNode } from "react";

interface Props {

    children: ReactNode;

}

export function EntitySheetFooter({

    children

}: Props) {

    return (

        <div className="sticky bottom-0 bg-background border-t px-6 py-4">

            <div className="flex justify-end gap-3">

                {children}

            </div>

        </div>

    );

}