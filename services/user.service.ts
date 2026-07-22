import { ObjectId } from "mongodb";

import { createUser } from "@/models/user.model";
import { userCollection } from "@/repositories/user.repository";
import { User } from "@/types/user";
import { byId, withStringId } from "@/lib/mongoId";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function getUsers(): Promise<User[]> {

    const collection = await userCollection();

    const usuarios = await collection
        .find({})
        .sort({ usuario: 1 })
        .toArray();

    return usuarios.map(withStringId);

}

export async function getUserById(id: string): Promise<User | null> {

    const collection = await userCollection();

    const usuario = await collection.findOne(byId<User>(id));

    return usuario ? withStringId(usuario) : null;

}

export async function getUserByUsuario(usuario: string): Promise<User | null> {

    const collection = await userCollection();

    const encontrado = await collection.findOne({ usuario });

    return encontrado ? withStringId(encontrado) : null;

}

async function contarAdministradoresActivos(
    excluirId?: string
): Promise<number> {

    const collection = await userCollection();

    const filtro: Record<string, unknown> = {
        rol: "ADMINISTRADOR",
        estado: "ACTIVO"
    };

    if (excluirId) {
        filtro._id = { $ne: new ObjectId(excluirId) };
    }

    return collection.countDocuments(filtro);

}

export async function createNewUser(data: {
    usuario: string;
    password: string;
    nombre: string;
    rol: User["rol"];
    estado?: User["estado"];
}): Promise<User> {

    const passwordHash = await hashPassword(data.password);

    const usuario = createUser({
        usuario: data.usuario,
        passwordHash,
        nombre: data.nombre,
        rol: data.rol,
        estado: data.estado
    });

    const collection = await userCollection();

    const result = await collection.insertOne(usuario);

    return {

        _id: result.insertedId.toString(),

        ...usuario

    };

}

export async function updateUser(
    id: string,
    data: Partial<{
        usuario: string;
        password: string;
        nombre: string;
        rol: User["rol"];
        estado: User["estado"];
    }>
): Promise<User | null> {

    const collection = await userCollection();

    if (data.rol && data.rol !== "ADMINISTRADOR") {

        const quedan = await contarAdministradoresActivos(id);

        if (quedan === 0) {

            throw new Error(
                "No se puede quitar el rol de Administrador: no quedaría ningún administrador activo."
            );

        }

    }

    if (data.estado === "INACTIVO") {

        const actual = await collection.findOne(byId<User>(id));

        if (actual?.rol === "ADMINISTRADOR") {

            const quedan = await contarAdministradoresActivos(id);

            if (quedan === 0) {

                throw new Error(
                    "No se puede desactivar: no quedaría ningún administrador activo."
                );

            }

        }

    }

    const update: Record<string, unknown> = {
        updatedAt: new Date()
    };

    if (data.usuario !== undefined) update.usuario = data.usuario;
    if (data.nombre !== undefined) update.nombre = data.nombre;
    if (data.rol !== undefined) update.rol = data.rol;
    if (data.estado !== undefined) update.estado = data.estado;

    if (data.password) {
        update.passwordHash = await hashPassword(data.password);
    }

    const result = await collection.findOneAndUpdate(
        byId<User>(id),
        { $set: update },
        { returnDocument: "after" }
    );

    return result ? withStringId(result) : null;

}

export async function deleteUser(id: string): Promise<boolean> {

    const collection = await userCollection();

    const actual = await collection.findOne(byId<User>(id));

    if (actual?.rol === "ADMINISTRADOR" && actual.estado === "ACTIVO") {

        const quedan = await contarAdministradoresActivos(id);

        if (quedan === 0) {

            throw new Error(
                "No se puede eliminar: no quedaría ningún administrador activo."
            );

        }

    }

    const result = await collection.deleteOne(byId<User>(id));

    return result.deletedCount === 1;

}

export async function verifyCredentials(
    usuario: string,
    password: string
): Promise<User | null> {

    const encontrado = await getUserByUsuario(usuario);

    if (!encontrado || encontrado.estado !== "ACTIVO") return null;

    const valido = await verifyPassword(password, encontrado.passwordHash);

    return valido ? encontrado : null;

}
