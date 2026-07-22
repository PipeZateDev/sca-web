import clientPromise from "@/lib/mongodb";
import { Schedule } from "@/types/schedule";
import { Collection } from "mongodb";

let indexEnsured = false;

export async function scheduleCollection(): Promise<Collection<Schedule>> {

    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection<Schedule>("horarios");

    if (!indexEnsured) {

        await collection.createIndex({ nombre: 1 }, { unique: true });

        indexEnsured = true;

    }

    return collection;

}
