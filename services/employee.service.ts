import { createEmployee } from "@/models/employee.model";
import { employeeCollection } from "@/repositories/employee.repository";
import { Employee } from "@/types/employee";
import { byId, withStringId } from "@/lib/mongoId";

export async function getEmployees(): Promise<Employee[]> {

    const collection = await employeeCollection();

    const empleados = await collection
        .find({})
        .sort({ nombre: 1 })
        .toArray();

    return empleados.map(withStringId);

}

export async function getEmployeeById(id: string): Promise<Employee | null> {

    const collection = await employeeCollection();

    const empleado = await collection.findOne(byId<Employee>(id));

    return empleado ? withStringId(empleado) : null;

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

export async function updateEmployee(
    id: string,
    data: Partial<Employee>
): Promise<Employee | null> {

    const collection = await employeeCollection();

    const update: Partial<Employee> = { ...data, updatedAt: new Date() };

    delete update._id;

    if (data.nombre !== undefined || data.apellidos !== undefined) {

        const actual = await collection.findOne(byId<Employee>(id));

        if (actual) {

            const nombre = data.nombre ?? actual.nombre;
            const apellidos = data.apellidos ?? actual.apellidos;

            update.nombreCompleto = `${nombre} ${apellidos}`.trim();

        }

    }

    const result = await collection.findOneAndUpdate(
        byId<Employee>(id),
        { $set: update },
        { returnDocument: "after" }
    );

    return result ? withStringId(result) : null;

}

export async function deleteEmployee(id: string): Promise<boolean> {

    const collection = await employeeCollection();

    const result = await collection.deleteOne(byId<Employee>(id));

    return result.deletedCount === 1;

}
