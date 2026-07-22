import clientPromise from "@/lib/mongodb";
import { AttendanceRecord } from "@/types/attendance";
import { Collection } from "mongodb";

let indexEnsured = false;

export async function attendanceCollection(): Promise<Collection<AttendanceRecord>> {

    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection<AttendanceRecord>("asistencias");

    if (!indexEnsured) {

        await collection.createIndex(
            { biometricoId: 1, fecha: 1 },
            { unique: true }
        );

        indexEnsured = true;

    }

    return collection;

}
