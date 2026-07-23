import { DiaSemana, Schedule } from "@/types/schedule";
import { anclarFechaBogota } from "@/lib/timezone";

export const DIA_POR_INDICE: DiaSemana[] = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO"
];

export function diaSemanaDe(fecha: Date): DiaSemana {

    return DIA_POR_INDICE[fecha.getUTCDay()];

}

export interface HorasEsperadas {
    horaEntrada: string;
    horaSalida: string;
}

export function resolveHorasEsperadas(
    schedule: Schedule,
    dia: DiaSemana,
    ignorarDiasLaborales = false
): HorasEsperadas | null {

    if (!ignorarDiasLaborales && !schedule.dias.includes(dia)) {
        return null;
    }

    const excepcion = schedule.excepciones.find((e) => e.dia === dia);

    if (excepcion) {

        return {
            horaEntrada: excepcion.horaEntrada,
            horaSalida: excepcion.horaSalida
        };

    }

    return {
        horaEntrada: schedule.horaEntrada,
        horaSalida: schedule.horaSalida
    };

}

export function aMinutos(hora: string): number {

    const [h, m] = hora.split(":").map(Number);

    return h * 60 + m;

}

export function minutosTrabajados(entrada?: string, salida?: string): number {

    if (!entrada || !salida) return 0;

    const minutos = aMinutos(salida) - aMinutos(entrada);

    return minutos > 0 ? minutos : 0;

}

export function addDays(fecha: Date, dias: number): Date {

    const resultado = new Date(fecha);

    resultado.setUTCDate(resultado.getUTCDate() + dias);

    return resultado;

}

export function startOfWeekMonday(fecha: Date): Date {

    const dia = anclarFechaBogota(fecha);

    const indice = dia.getUTCDay();

    const diferenciaHastaLunes = indice === 0 ? -6 : 1 - indice;

    return addDays(dia, diferenciaHastaLunes);

}

export type AttendanceEstado =
    | "A_TIEMPO"
    | "TARDANZA"
    | "AUSENTE"
    | "PENDIENTE"
    | "SIN_HORARIO"
    | "NO_LABORAL"
    | "FESTIVO"
    | "DOMINICAL";

export function festivoAplica(
    horariosFestivo: string[],
    horarioEmpleado: string
): boolean {

    return (
        horariosFestivo.length === 0 ||
        horariosFestivo.includes(horarioEmpleado)
    );

}

export function calcularEstado(params: {
    horaEsperada: string | null;
    entrada?: string;
    fecha: Date;
    hoy: Date;
}): AttendanceEstado {

    const { horaEsperada, entrada, fecha, hoy } = params;

    if (horaEsperada === null) {
        return "NO_LABORAL";
    }

    if (!entrada) {

        return fecha.getTime() > hoy.getTime() ? "PENDIENTE" : "AUSENTE";

    }

    return aMinutos(entrada) > aMinutos(horaEsperada) ? "TARDANZA" : "A_TIEMPO";

}
