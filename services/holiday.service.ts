import { createHoliday } from "@/models/holiday.model";
import { holidayCollection } from "@/repositories/holiday.repository";
import { Holiday } from "@/types/holiday";
import { byId } from "@/lib/mongoId";

export async function getHolidays(): Promise<Holiday[]> {

    const collection = await holidayCollection();

    return await collection
        .find({})
        .sort({ fecha: 1 })
        .toArray();

}

export async function getHolidaysForDate(fecha: Date): Promise<Holiday[]> {

    const collection = await holidayCollection();

    return await collection
        .find({ fecha })
        .toArray();

}

export async function createNewHoliday(
    data: Partial<Holiday>
): Promise<Holiday> {

    const holiday = createHoliday(data);

    const collection = await holidayCollection();

    const result = await collection.insertOne(holiday);

    return {

        _id: result.insertedId.toString(),

        ...holiday

    };

}

export async function deleteHoliday(id: string): Promise<boolean> {

    const collection = await holidayCollection();

    const result = await collection.deleteOne(byId<Holiday>(id));

    return result.deletedCount === 1;

}
