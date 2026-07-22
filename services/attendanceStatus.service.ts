import { Employee } from "@/types/employee";
import { Schedule } from "@/types/schedule";
import { Holiday } from "@/types/holiday";
import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";

import {
    diaSemanaDe,
    resolveHorasEsperadas,
    minutosTrabajados,
    calcularEstado,
    festivoAplica,
    startOfWeekMonday,
    addDays,
    AttendanceEstado
} from "@/lib/scheduleEngine";

import { getEmployees } from "@/services/employee.service";
import { getSchedules } from "@/services/schedule.service";
import { getAttendance, getTodayAttendanceCount } from "@/services/attendance.service";
import { getHolidaysForDate } from "@/services/holiday.service";

function inicioDelDia(fecha: Date): Date {

    const resultado = new Date(fecha);

    resultado.setHours(0, 0, 0, 0);

    return resultado;

}

async function cargarContexto() {

    const empleados = (await getEmployees()).filter((e) => e.estado === "ACTIVO");

    const horarios = await getSchedules();

    const horarioPorNombre = new Map<string, Schedule>(
        horarios.map((h) => [h.nombre, h])
    );

    return { empleados, horarioPorNombre };

}

function construirEstadoDelDia(
    empleado: Employee,
    horarioPorNombre: Map<string, Schedule>,
    festivosDelDia: Holiday[],
    fecha: Date,
    hoy: Date,
    registro: { entrada?: string; salida?: string; marcaciones: string[] } | undefined
): EmployeeDayStatus {

    const schedule = empleado.horario
        ? horarioPorNombre.get(empleado.horario)
        : undefined;

    const dia = diaSemanaDe(fecha);

    const horasEsperadas = schedule
        ? resolveHorasEsperadas(schedule, dia)
        : null;

    const festivoAplicable = festivosDelDia.some((f) =>
        festivoAplica(f.horarios, empleado.horario)
    );

    let estado: AttendanceEstado;

    if (festivoAplicable) {

        estado = "FESTIVO";

    } else if (!schedule) {

        estado = "SIN_HORARIO";

    } else {

        estado = calcularEstado({
            horaEsperada: horasEsperadas?.horaEntrada ?? null,
            entrada: registro?.entrada,
            fecha,
            hoy
        });

    }

    return {

        empleadoId: empleado._id!,

        nombreCompleto: empleado.nombreCompleto,

        dependencia: empleado.dependencia,

        horarioNombre: empleado.horario || undefined,

        fecha,

        estado,

        horaEsperada: horasEsperadas?.horaEntrada,

        entrada: registro?.entrada,

        salida: registro?.salida,

        marcaciones: registro?.marcaciones ?? [],

        minutosTrabajados: minutosTrabajados(registro?.entrada, registro?.salida)

    };

}

export async function getDailyStatus(fecha: Date): Promise<EmployeeDayStatus[]> {

    const fechaNormalizada = inicioDelDia(fecha);

    const { empleados, horarioPorNombre } = await cargarContexto();

    const registros = await getAttendance({
        desde: fechaNormalizada,
        hasta: fechaNormalizada
    });

    const registroPorEmpleado = new Map(
        registros
            .filter((r) => r.empleadoId)
            .map((r) => [r.empleadoId as string, r])
    );

    const festivosDelDia = await getHolidaysForDate(fechaNormalizada);

    const hoy = inicioDelDia(new Date());

    return empleados.map((empleado) =>
        construirEstadoDelDia(
            empleado,
            horarioPorNombre,
            festivosDelDia,
            fechaNormalizada,
            hoy,
            registroPorEmpleado.get(empleado._id!)
        )
    );

}

function enumerarDias(desde: Date, hasta: Date): Date[] {

    const inicio = inicioDelDia(desde);
    const fin = inicioDelDia(hasta);

    const dias: Date[] = [];
    let cursor = inicio;

    while (cursor.getTime() <= fin.getTime()) {

        dias.push(cursor);
        cursor = addDays(cursor, 1);

    }

    return dias;

}

export async function getRangeStatuses(
    desde: Date,
    hasta: Date
): Promise<EmployeeDayStatus[]> {

    const dias = enumerarDias(desde, hasta);

    const estadosPorDia = await Promise.all(dias.map((d) => getDailyStatus(d)));

    return estadosPorDia.flat();

}

export async function getRangeSummary(
    desde: Date,
    hasta: Date
): Promise<EmployeeWeekSummary[]> {

    const dias = enumerarDias(desde, hasta);

    const estadosPorDia = await Promise.all(dias.map((d) => getDailyStatus(d)));

    const resumenPorEmpleado = new Map<string, EmployeeWeekSummary>();

    for (const estadosDelDia of estadosPorDia) {

        for (const estado of estadosDelDia) {

            let acumulado = resumenPorEmpleado.get(estado.empleadoId);

            if (!acumulado) {

                acumulado = {
                    empleadoId: estado.empleadoId,
                    nombreCompleto: estado.nombreCompleto,
                    dependencia: estado.dependencia,
                    horarioNombre: estado.horarioNombre,
                    minutosTotales: 0,
                    tardanzas: 0,
                    ausencias: 0,
                    diasLaborados: 0
                };

                resumenPorEmpleado.set(estado.empleadoId, acumulado);

            }

            acumulado.minutosTotales += estado.minutosTrabajados;

            if (estado.estado === "TARDANZA") acumulado.tardanzas++;
            if (estado.estado === "AUSENTE") acumulado.ausencias++;
            if (estado.estado === "A_TIEMPO" || estado.estado === "TARDANZA") {
                acumulado.diasLaborados++;
            }

        }

    }

    return Array.from(resumenPorEmpleado.values()).sort(
        (a, b) =>
            (a.horarioNombre ?? "").localeCompare(b.horarioNombre ?? "") ||
            a.nombreCompleto.localeCompare(b.nombreCompleto)
    );

}

export async function getWeeklySummary(weekStart: Date): Promise<EmployeeWeekSummary[]> {

    const lunes = startOfWeekMonday(weekStart);

    return getRangeSummary(lunes, addDays(lunes, 6));

}

export async function getEmployeeWeekDetail(
    employeeId: string,
    weekStart: Date
): Promise<EmployeeDayStatus[]> {

    const lunes = startOfWeekMonday(weekStart);

    const dias = Array.from({ length: 7 }, (_, i) => addDays(lunes, i));

    const estadosPorDia = await Promise.all(dias.map((d) => getDailyStatus(d)));

    return estadosPorDia
        .map((estadosDelDia) =>
            estadosDelDia.find((e) => e.empleadoId === employeeId)
        )
        .filter((e): e is EmployeeDayStatus => Boolean(e));

}

export interface TodayCounts {
    empleados: number;
    asistenciasHoy: number;
    tardanzas: number;
    ausentes: number;
}

export async function getTodayCounts(): Promise<TodayCounts> {

    const empleados = await getEmployees();
    const activos = empleados.filter((e) => e.estado === "ACTIVO").length;

    const asistenciasHoy = await getTodayAttendanceCount();

    const estadosHoy = await getDailyStatus(new Date());

    const tardanzas = estadosHoy.filter((e) => e.estado === "TARDANZA").length;
    const ausentes = estadosHoy.filter((e) => e.estado === "AUSENTE").length;

    return { empleados: activos, asistenciasHoy, tardanzas, ausentes };

}
