import { createEmployee } from "@/models/employee.model";
import { employeeCollection } from "@/repositories/employee.repository";
import { Employee } from "@/types/employee";

export async function getEmployees(): Promise<Employee[]> {

    const collection = await employeeCollection();

    return await collection
        .find({})
        .sort({ nombre: 1 })
        .toArray();

}

export async function createNewEmployee(
    data: Partial<Employee>
): Promise<Employee> {

    const employee = createEmployee(data);

    const collection = await employeeCollection();

    const result = await collection.insertOne(employee);

    return {

        _id: result.insertedId.toString(),

        ...employee

    };

}