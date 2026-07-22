import { Schedule } from "@/types/schedule";

export function createSchedule(data: Partial<Schedule>): Schedule {

    return {

        nombre: data.nombre ?? "",

        dias: data.dias ?? [],

        horaEntrada: data.horaEntrada ?? "",

        horaSalida: data.horaSalida ?? "",

        excepciones: data.excepciones ?? [],

        createdAt: new Date(),

        updatedAt: new Date()

    };

}
