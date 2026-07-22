import * as XLSX from "xlsx";

export interface ParsedAttendancePunch {
    biometricoId: string;
    nombre: string;
    departamento: string;
    fecha: Date;
    marcaciones: string[];
}

export interface ParsedAttendanceWorkbook {
    periodoInicio: Date;
    periodoFin: Date;
    registros: ParsedAttendancePunch[];
}

function cellText(value: unknown): string {

    return value === null || value === undefined ? "" : String(value).trim();

}

function parseDdMmYyyy(text: string): Date {

    const [dia, mes, anio] = text.split("/").map(Number);

    return new Date(anio, mes - 1, dia);

}

function findSheetName(workbook: XLSX.WorkBook): string {

    const name = workbook.SheetNames.find((n) =>
        n.toLowerCase().includes("registro")
    );

    if (!name) {
        throw new Error(
            "No se encontró la hoja 'Registro asistencia' en el archivo."
        );
    }

    return name;

}

export function parseAttendanceWorkbook(
    buffer: Buffer,
): ParsedAttendanceWorkbook {

    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = findSheetName(workbook);

    const sheet = workbook.Sheets[sheetName];

    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: null,
        raw: false
    });

    const periodoRow = rows.find((row) => cellText(row[0]) === "Date :");

    if (!periodoRow) {
        throw new Error(
            "No se encontró el rango de fechas ('Date :') en la hoja."
        );
    }

    const periodoTexto = periodoRow
        .map(cellText)
        .find((valor) => valor.includes("~"));

    if (!periodoTexto) {
        throw new Error("No se pudo leer el rango de fechas del periodo.");
    }

    const [rawInicio, rawFin] = periodoTexto.split("~").map((s) => s.trim());

    const periodoInicio = parseDdMmYyyy(rawInicio);
    const periodoFin = parseDdMmYyyy(rawFin);

    const numDias =
        Math.round(
            (periodoFin.getTime() - periodoInicio.getTime()) / 86_400_000
        ) + 1;

    const registros: ParsedAttendancePunch[] = [];

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        const idIdx = row.findIndex((c) => cellText(c) === "ID :");

        if (idIdx === -1) continue;

        const nombreIdx = row.findIndex((c) => cellText(c) === "Nombre :");
        const deptIdx = row.findIndex((c) => cellText(c) === "Dept. :");

        const biometricoId = cellText(row[idIdx + 2]);

        if (!biometricoId) continue;

        const nombre = nombreIdx >= 0 ? cellText(row[nombreIdx + 2]) : "";
        const departamento = deptIdx >= 0 ? cellText(row[deptIdx + 2]) : "";

        const dataRow = rows[i + 1] ?? [];

        for (let dia = 0; dia < numDias; dia++) {

            const raw = cellText(dataRow[dia]);

            if (!raw) continue;

            const marcaciones = raw
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean);

            if (marcaciones.length === 0) continue;

            const fecha = new Date(periodoInicio);
            fecha.setDate(fecha.getDate() + dia);

            registros.push({ biometricoId, nombre, departamento, fecha, marcaciones });

        }

    }

    return { periodoInicio, periodoFin, registros };

}
