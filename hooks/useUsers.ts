"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { User } from "@/types/user";

export type SafeUser = Omit<User, "passwordHash">;

export interface UserFormInput {
    usuario: string;
    password?: string;
    nombre: string;
    rol: User["rol"];
    estado: User["estado"];
}

export function useUsers() {

    const [users, setUsers] = useState<SafeUser[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadUsers() {

        try {

            setLoading(true);

            const response = await fetch("/api/usuarios");

            if (!response.ok) {
                throw new Error("No fue posible cargar los usuarios.");
            }

            const data = await response.json();

            setUsers(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setUsers([]);

            toast.error("No fue posible cargar los usuarios.");

        } finally {

            setLoading(false);

        }

    }

    async function createUser(data: UserFormInput) {

        try {

            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(body?.message ?? "Error creando usuario.");
            }

            toast.success("Usuario creado correctamente.");
            await loadUsers();

            return true;

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error ? error.message : "No fue posible crear el usuario."
            );

            return false;

        }

    }

    async function updateUser(id: string, data: Partial<UserFormInput>) {

        try {

            const response = await fetch(`/api/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(body?.message ?? "Error actualizando usuario.");
            }

            toast.success("Usuario actualizado correctamente.");
            await loadUsers();

            return true;

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error ? error.message : "No fue posible actualizar el usuario."
            );

            return false;

        }

    }

    async function deleteUser(id: string) {

        try {

            const response = await fetch(`/api/usuarios/${id}`, {
                method: "DELETE"
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(body?.message ?? "Error eliminando usuario.");
            }

            toast.success("Usuario eliminado correctamente.");
            await loadUsers();

            return true;

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error ? error.message : "No fue posible eliminar el usuario."
            );

            return false;

        }

    }

    useEffect(() => {

        loadUsers();

    }, []);

    return {

        users,

        loading,

        reload: loadUsers,

        createUser,

        updateUser,

        deleteUser

    };

}
