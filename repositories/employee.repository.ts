import clientPromise from "@/lib/mongodb";
import { Employee } from "@/types/employee";
import { Collection } from "mongodb";

export async function employeeCollection(): Promise<Collection<Employee>> {

    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    return db.collection<Employee>("empleados");

}