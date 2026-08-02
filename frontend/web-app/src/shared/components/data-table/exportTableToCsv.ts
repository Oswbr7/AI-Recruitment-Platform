import type { Table } from "@tanstack/react-table";

export function exportTableToCsv<TData>(
    table: Table<TData>,
    filename: string
) {

    const columns = table
        .getVisibleLeafColumns()
        .filter(column => "accessorKey" in column.columnDef);

    const headers = columns.map(column =>
        typeof column.columnDef.header === "string"
            ? column.columnDef.header
            : column.id
    );

    const rows = table.getFilteredRowModel().rows.map(row =>
        columns.map(column => {
            const value = row.getValue(column.id);
            return value === null || value === undefined ? "" : String(value);
        })
    );

    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
        .map(line => line.map(escape).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

}
