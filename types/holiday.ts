export type TipoFestivo = "FESTIVO" | "EVENTO";

export interface Holiday {

    _id?: string;

    fecha: Date;

    nombre: string;

    tipo: TipoFestivo;

    horarios: string[];

    createdAt?: Date;
}
