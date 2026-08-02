import type { Column } from "@tanstack/react-table";
import { CheckIcon, ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Option {

    label: string;

    value: string;

}

interface Props<TData, TValue> {

    column?: Column<TData, TValue>;

    title: string;

    options: Option[];

}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: Props<TData, TValue>) {

    const selected = new Set((column?.getFilterValue() as string[]) ?? []);

    const toggle = (value: string) => {

        const next = new Set(selected);

        if (next.has(value))
            next.delete(value);
        else
            next.add(value);

        column?.setFilterValue(next.size ? Array.from(next) : undefined);

    };

    return (

        <DropdownMenu>

            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>

                <ListFilter className="mr-1.5 h-4 w-4" />

                {title}

                {selected.size > 0 && (
                    <span className="ml-1.5 rounded bg-muted px-1.5 text-xs">
                        {selected.size}
                    </span>
                )}

            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">

                {options.map(option => (

                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => toggle(option.value)}
                        className={cn(selected.has(option.value) && "font-medium")}
                    >

                        <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-input">
                            {selected.has(option.value) && <CheckIcon className="h-3 w-3" />}
                        </span>

                        {option.label}

                    </DropdownMenuItem>

                ))}

                {selected.size > 0 && (

                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => column?.setFilterValue(undefined)}>
                            Clear filters
                        </DropdownMenuItem>
                    </>

                )}

            </DropdownMenuContent>

        </DropdownMenu>

    );

}
