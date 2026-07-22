export interface CsvColumn {
    key: string;
    label: string;
}

export function toCSV(
    rows: Record<string, unknown>[],
    columns: CsvColumn[]
): string {

    function celda(valor: unknown): string {

        const texto = valor === null || valor === undefined ? "" : String(valor);

        return `"${texto.replace(/"/g, '""')}"`;

    }

    const encabezado = columns.map((c) => celda(c.label)).join(",");

    const lineas = rows.map((row) =>
        columns.map((c) => celda(row[c.key])).join(",")
    );

    return [encabezado, ...lineas].join("\n");

}

export function downloadCSV(filename: string, csv: string): void {

    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}
