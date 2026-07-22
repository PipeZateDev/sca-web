export type Role = "ADMINISTRADOR" | "COORDINADOR" | "CONSULTA";

export type EstadoUsuario = "ACTIVO" | "INACTIVO";

export interface User {

    _id?: string;

    usuario: string;

    passwordHash: string;

    nombre: string;

    rol: Role;

    estado: EstadoUsuario;

    createdAt?: Date;

    updatedAt?: Date;
}
