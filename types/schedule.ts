export type DiaSemana =
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO"
    | "DOMINGO";

export interface ScheduleException {
    dia: DiaSemana;
    horaEntrada: string;
    horaSalida: string;
}

export interface Schedule {
    _id?: string;

    nombre: string;

    dias: DiaSemana[];

    horaEntrada: string;

    horaSalida: string;

    excepciones: ScheduleException[];

    createdAt?: Date;

    updatedAt?: Date;
}
