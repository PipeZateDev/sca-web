"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginForm() {

    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, password })
            });

            const data = await response.json();

            if (!response.ok) {

                toast.error(data?.message ?? "No fue posible iniciar sesión.");
                return;

            }

            toast.success(`Bienvenido, ${data.nombre}`);

            router.push("/dashboard");
            router.refresh();

        } catch (error) {

            console.error(error);
            toast.error("No fue posible iniciar sesión.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Usuario</label>

                <input
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    autoFocus
                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />

            </div>

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Contraseña</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />

            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
            >
                {loading ? "Ingresando..." : "Ingresar"}
            </button>

        </form>

    );

}
