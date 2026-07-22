import { createSchedule } from "@/models/schedule.model";
import { scheduleCollection } from "@/repositories/schedule.repository";
import { Schedule } from "@/types/schedule";
import { byId } from "@/lib/mongoId";

export async function getSchedules(): Promise<Schedule[]> {

    const collection = await scheduleCollection();

    return await collection
        .find({})
        .sort({ nombre: 1 })
        .toArray();

}

export async function createNewSchedule(
    data: Partial<Schedule>
): Promise<Schedule> {

    const schedule = createSchedule(data);

    const collection = await scheduleCollection();

    const result = await collection.insertOne(schedule);

    return {

        _id: result.insertedId.toString(),

        ...schedule

    };

}

export async function updateSchedule(
    id: string,
    data: Partial<Schedule>
): Promise<Schedule | null> {

    const collection = await scheduleCollection();

    const update = {
        nombre: data.nombre,
        dias: data.dias,
        horaEntrada: data.horaEntrada,
        horaSalida: data.horaSalida,
        excepciones: data.excepciones,
        updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
        byId<Schedule>(id),
        { $set: update },
        { returnDocument: "after" }
    );

    return result;

}

export async function deleteSchedule(id: string): Promise<boolean> {

    const collection = await scheduleCollection();

    const result = await collection.deleteOne(byId<Schedule>(id));

    return result.deletedCount === 1;

}
