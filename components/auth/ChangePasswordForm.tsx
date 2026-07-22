"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ChangePasswordForm() {

    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        if (!actual || !nueva) {
            alert("Debe ingresar la contraseña actual y la nueva.");
            return;
        }

        if (nueva !== confirmar) {
            alert("La confirmación no coincide con la nueva contraseña.");
            return;
        }

        setSaving(true);

        try {

            const response = await fetch("/api/auth/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actual, nueva })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message ?? "Error cambiando la contraseña.");
            }

            toast.success("Contraseña actualizada correctamente.");

            setActual("");
            setNueva("");
            setConfirmar("");

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error ? error.message : "Error cambiando la contraseña."
            );

        } finally {

            setSaving(false);

        }

    }

    return (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Contraseña actual</label>

                <input
                    type="password"
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    className="rounded-lg border p-2"
                />

            </div>

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Nueva contraseña</label>

                <input
                    type="password"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    className="rounded-lg border p-2"
                />

            </div>

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Confirmar nueva contraseña</label>

                <input
                    type="password"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    className="rounded-lg border p-2"
                />

            </div>

            <button
                type="submit"
                disabled={saving}
                className="mt-2 self-start rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
            >
                {saving ? "Guardando..." : "Cambiar contraseña"}
            </button>

        </form>

    );

}
