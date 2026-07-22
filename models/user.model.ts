import { User } from "@/types/user";

export function createUser(data: Partial<User>): User {

    return {

        usuario: data.usuario ?? "",

        passwordHash: data.passwordHash ?? "",

        nombre: data.nombre ?? "",

        rol: data.rol ?? "CONSULTA",

        estado: data.estado ?? "ACTIVO",

        createdAt: new Date(),

        updatedAt: new Date()

    };

}
