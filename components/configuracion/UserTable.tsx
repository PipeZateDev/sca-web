"use client";

import { Pencil, Trash2 } from "lucide-react";

import { SafeUser } from "@/hooks/useUsers";

interface Props {
    users: SafeUser[];
    loading: boolean;
    onEdit: (user: SafeUser) => void;
    onDelete: (user: SafeUser) => void;
}

const ROL_LABEL: Record<string, string> = {
    ADMINISTRADOR: "Administrador",
    COORDINADOR: "Coordinador",
    CONSULTA: "Consulta"
};

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {

    if (loading) {

        return (

            <div className="rounded-2xl border bg-white p-10 text-center shadow">
                Cargando usuarios...
            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-2xl border bg-white shadow">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="p-4 text-left">Usuario</th>
                        <th className="text-left">Nombre</th>
                        <th className="text-left">Rol</th>
                        <th className="text-left">Estado</th>
                        <th className="text-center">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {users.length === 0 ? (

                        <tr>

                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                No existen usuarios registrados.
                            </td>

                        </tr>

                    ) : (

                        users.map((user) => (

                            <tr key={user._id} className="border-t">

                                <td className="p-4 font-medium">{user.usuario}</td>

                                <td>{user.nombre}</td>

                                <td>{ROL_LABEL[user.rol] ?? user.rol}</td>

                                <td>

                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            user.estado === "ACTIVO"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {user.estado}
                                    </span>

                                </td>

                                <td>

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(user)}
                                            className="rounded-full p-2 text-green-600 transition-all duration-150 hover:scale-110 hover:bg-green-100"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(user)}
                                            className="rounded-full p-2 text-red-600 transition-all duration-150 hover:scale-110 hover:bg-red-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}
