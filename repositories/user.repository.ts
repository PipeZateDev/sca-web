import clientPromise from "@/lib/mongodb";
import { User } from "@/types/user";
import { Collection } from "mongodb";

let indexEnsured = false;

export async function userCollection(): Promise<Collection<User>> {

    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection<User>("usuarios");

    if (!indexEnsured) {

        await collection.createIndex({ usuario: 1 }, { unique: true });

        indexEnsured = true;

    }

    return collection;

}
