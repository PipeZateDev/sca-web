export interface AttendanceRecord {
    _id?: string;

    biometricoId: string;

    empleadoId?: string;

    nombreArchivo: string;

    departamentoArchivo: string;

    fecha: Date;

    marcaciones: string[];

    entrada?: string;

    salida?: string;

    origenArchivo: string;

    periodoInicio: Date;

    periodoFin: Date;

    createdAt?: Date;
}
