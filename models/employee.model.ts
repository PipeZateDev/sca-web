import { Employee } from "@/types/employee";

export function createEmployee(data: Partial<Employee>): Employee {

    return {

        codigo: data.codigo ?? "",

        tipoDocumento: data.tipoDocumento ?? "CC",

        documento: data.documento ?? "",

        nombre: data.nombre ?? "",

        apellidos: data.apellidos ?? "",

        nombreCompleto: `${data.nombre ?? ""} ${data.apellidos ?? ""}`.trim(),

        correo: data.correo ?? "",

        telefono: data.telefono ?? "",

        cargo: data.cargo ?? "",

        dependencia: data.dependencia ?? "",

        tipoContrato: data.tipoContrato ?? "",

        horario: data.horario ?? "",

        biometrico: data.biometrico ?? "",

        estado: data.estado ?? "ACTIVO",

        fechaIngreso: data.fechaIngreso ?? new Date(),

        observaciones: data.observaciones ?? "",

        createdAt: new Date(),

        updatedAt: new Date()

    };

}