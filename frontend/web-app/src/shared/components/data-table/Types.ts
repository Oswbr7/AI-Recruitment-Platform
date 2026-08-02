import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

export type RenderBulkActions<TData> = (
    selectedRows: TData[],
    clearSelection: () => void
) => ReactNode;

export type RenderFilters<TData> = (
    table: Table<TData>
) => ReactNode;
