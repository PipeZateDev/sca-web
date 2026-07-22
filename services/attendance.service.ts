import { createAttendanceRecord } from "@/models/attendance.model";
import { attendanceCollection } from "@/repositories/attendance.repository";
import { AttendanceRecord } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { withStringId } from "@/lib/mongoId";

import {
    getEmployees,
    createNewEmployee,
    updateEmployee
} from "@/services/employee.service";

import { parseAttendanceWorkbook } from "@/lib/parsers/attendanceWorkbook";
import { esEstudiante, DEPENDENCIA_ESTUDIANTE } from "@/lib/students";

export interface ImportAttendanceSummary {

    periodoInicio: Date;

    periodoFin: Date;

    registrosImportados: number;

    empleadosVinculados: number;

    empleadosCreados: { biometricoId: string; nombre: string }[];

}

function splitNombre(nombreCrudo: string): { nombre: string; apellidos: string } {

    const partes = nombreCrudo.trim().split(/\s+/);

    return {
        nombre: partes[0] ?? "",
        apellidos: partes.slice(1).join(" ")
    };

}

export async function importAttendanceWorkbook(
    buffer: Buffer,
    filename: string
): Promise<ImportAttendanceSummary> {

    const { periodoInicio, periodoFin, registros } = parseAttendanceWorkbook(buffer);

    const empleados = await getEmployees();

    const empleadosPorBiometrico = new Map<string, Employee>(
        empleados
            .filter((e) => e.biometrico)
            .map((e) => [e.biometrico, e])
    );

    const idsExistentesAlInicio = new Set(empleadosPorBiometrico.keys());

    const empleadosCreados: { biometricoId: string; nombre: string }[] = [];
    const empleadosVinculadosIds = new Set<string>();

    const documentos: AttendanceRecord[] = [];

    for (const registro of registros) {

        let empleado = empleadosPorBiometrico.get(registro.biometricoId);

        if (empleado) {

            if (idsExistentesAlInicio.has(registro.biometricoId)) {
                empleadosVinculadosIds.add(registro.biometricoId);
            }

            if (
                esEstudiante(registro.departamento) &&
                !esEstudiante(empleado.dependencia) &&
                empleado._id
            ) {

                const actualizado = await updateEmployee(empleado._id, {
                    dependencia: DEPENDENCIA_ESTUDIANTE
                });

                if (actualizado) {
                    empleado = actualizado;
                    empleadosPorBiometrico.set(registro.biometricoId, actualizado);
                }

            }

        } else {

            const { nombre, apellidos } = splitNombre(registro.nombre);

            const nuevo = await createNewEmployee({
                codigo: registro.biometricoId,
                biometrico: registro.biometricoId,
                nombre,
                apellidos,
                dependencia: registro.departamento,
                estado: "ACTIVO"
            });

            empleadosPorBiometrico.set(registro.biometricoId, nuevo);
            empleadosCreados.push({
                biometricoId: registro.biometricoId,
                nombre: registro.nombre
            });

            empleado = nuevo;

        }

        documentos.push(
            createAttendanceRecord({
                biometricoId: registro.biometricoId,
                empleadoId: empleado._id,
                nombreArchivo: registro.nombre,
                departamentoArchivo: registro.departamento,
                fecha: registro.fecha,
                marcaciones: registro.marcaciones,
                origenArchivo: filename,
                periodoInicio,
                periodoFin
            })
        );

    }

    if (documentos.length > 0) {

        const collection = await attendanceCollection();

        await collection.bulkWrite(
            documentos.map((doc) => ({
                updateOne: {
                    filter: { biometricoId: doc.biometricoId, fecha: doc.fecha },
                    update: { $set: doc },
                    upsert: true
                }
            }))
        );

    }

    return {
        periodoInicio,
        periodoFin,
        registrosImportados: documentos.length,
        empleadosVinculados: empleadosVinculadosIds.size,
        empleadosCreados
    };

}

export interface AttendanceFilters {
    desde?: Date;
    hasta?: Date;
    biometricoId?: string;
}

export async function getAttendance(
    filters: AttendanceFilters
): Promise<AttendanceRecord[]> {

    const collection = await attendanceCollection();

    const query: Record<string, unknown> = {};

    if (filters.desde || filters.hasta) {

        const fecha: Record<string, Date> = {};

        if (filters.desde) fecha.$gte = filters.desde;
        if (filters.hasta) fecha.$lte = filters.hasta;

        query.fecha = fecha;

    }

    if (filters.biometricoId) {
        query.biometricoId = filters.biometricoId;
    }

    const registros = await collection
        .find(query)
        .sort({ fecha: -1, biometricoId: 1 })
        .toArray();

    return registros.map((registro) => ({
        ...withStringId(registro),
        empleadoId: registro.empleadoId !== undefined ? String(registro.empleadoId) : undefined
    }));

}

export async function getTodayAttendanceCount(): Promise<number> {

    const collection = await attendanceCollection();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const distintos = await collection.distinct("biometricoId", {
        fecha: { $gte: hoy, $lt: manana }
    });

    return distintos.length;

}
