import { AttendanceEstado } from "@/lib/scheduleEngine";

export interface EmployeeDayStatus {

    empleadoId: string;

    nombreCompleto: string;

    dependencia: string;

    horarioNombre?: string;

    fecha: Date;

    estado: AttendanceEstado;

    horaEsperada?: string;

    entrada?: string;

    salida?: string;

    marcaciones: string[];

    minutosTrabajados: number;

}

export interface EmployeeWeekSummary {

    empleadoId: string;

    nombreCompleto: string;

    dependencia: string;

    horarioNombre?: string;

    minutosTotales: number;

    tardanzas: number;

    ausencias: number;

    diasLaborados: number;

}
