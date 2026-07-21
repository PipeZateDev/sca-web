export type EmployeeStatus = "ACTIVO" | "INACTIVO";

export interface Employee {
    _id?: string;

    codigo: string;

    tipoDocumento: string;

    documento: string;

    nombre: string;

    apellidos: string;

    nombreCompleto: string;

    correo: string;

    telefono: string;

    cargo: string;

    dependencia: string;

    tipoContrato: string;

    horario: string;

    biometrico: string;

    estado: EmployeeStatus;

    fechaIngreso: Date;

    observaciones?: string;

    createdAt?: Date;

    updatedAt?: Date;
}