import clientPromise from "@/lib/mongodb";
import { Holiday } from "@/types/holiday";
import { Collection } from "mongodb";

export async function holidayCollection(): Promise<Collection<Holiday>> {

    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    return db.collection<Holiday>("festivos");

}
