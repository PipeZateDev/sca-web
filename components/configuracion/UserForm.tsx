"use client";

import { useState } from "react";

import { Role, EstadoUsuario } from "@/types/user";
import { SafeUser, UserFormInput } from "@/hooks/useUsers";

interface Props {

    initialValue?: SafeUser;

    onSave: (data: UserFormInput) => Promise<boolean>;

    onCancel: () => void;

}

export default function UserForm({ initialValue, onSave, onCancel }: Props) {

    const [usuario, setUsuario] = useState(initialValue?.usuario ?? "");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
    const [rol, setRol] = useState<Role>(initialValue?.rol ?? "CONSULTA");
    const [estado, setEstado] = useState<EstadoUsuario>(initialValue?.estado ?? "ACTIVO");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        if (!usuario.trim()) {
            alert("Debe ingresar el usuario.");
            return;
        }

        if (!initialValue && !password.trim()) {
            alert("Debe ingresar una contraseña.");
            return;
        }

        if (!nombre.trim()) {
            alert("Debe ingresar el nombre.");
            return;
        }

        setSaving(true);

        const data: UserFormInput = {
            usuario: usuario.trim(),
            nombre: nombre.trim(),
            rol,
            estado
        };

        if (password.trim()) {
            data.password = password.trim();
        }

        const ok = await onSave(data);

        setSaving(false);

        if (ok && !initialValue) {

            setUsuario("");
            setPassword("");
            setNombre("");
            setRol("CONSULTA");
            setEstado("ACTIVO");

        }

    }

    return (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario"
                className="rounded-lg border p-2"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={initialValue ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                className="rounded-lg border p-2"
            />

            <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                className="rounded-lg border p-2"
            />

            <select
                value={rol}
                onChange={(e) => setRol(e.target.value as Role)}
                className="rounded-lg border p-2"
            >

                <option value="ADMINISTRADOR">Administrador</option>
                <option value="COORDINADOR">Coordinador</option>
                <option value="CONSULTA">Consulta</option>

            </select>

            <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoUsuario)}
                className="rounded-lg border p-2"
            >

                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>

            </select>

            <div className="mt-2 flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border px-4 py-2"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {saving ? "Guardando..." : "Guardar"}
                </button>

            </div>

        </form>

    );

}
