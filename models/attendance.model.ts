import { AttendanceRecord } from "@/types/attendance";

export function createAttendanceRecord(
    data: Partial<AttendanceRecord>
): AttendanceRecord {

    const marcaciones = data.marcaciones ?? [];

    const ordenadas = [...marcaciones].sort();

    return {

        biometricoId: data.biometricoId ?? "",

        empleadoId: data.empleadoId,

        nombreArchivo: data.nombreArchivo ?? "",

        departamentoArchivo: data.departamentoArchivo ?? "",

        fecha: data.fecha ?? new Date(),

        marcaciones,

        entrada: ordenadas[0],

        salida: ordenadas.length > 1 ? ordenadas[ordenadas.length - 1] : undefined,

        origenArchivo: data.origenArchivo ?? "",

        periodoInicio: data.periodoInicio ?? new Date(),

        periodoFin: data.periodoFin ?? new Date(),

        createdAt: new Date()

    };

}
