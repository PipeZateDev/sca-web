import { Holiday } from "@/types/holiday";

export function createHoliday(data: Partial<Holiday>): Holiday {

    return {

        fecha: data.fecha ?? new Date(),

        nombre: data.nombre ?? "",

        tipo: data.tipo ?? "FESTIVO",

        dependencias: data.dependencias ?? [],

        createdAt: new Date()

    };

}
