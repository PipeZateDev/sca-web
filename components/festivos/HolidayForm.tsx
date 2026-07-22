"use client";

import { useEffect, useState } from "react";

import { TipoFestivo } from "@/types/holiday";

export interface HolidayFormData {
    fecha: string;
    nombre: string;
    tipo: TipoFestivo;
    dependencias: string[];
}

interface Props {
    fechaInicial?: string;
    dependenciasDisponibles: string[];
    onSave: (data: HolidayFormData) => Promise<boolean>;
    onCancel: () => void;
}

export default function HolidayForm({

    fechaInicial,

    dependenciasDisponibles,

    onSave,

    onCancel

}: Props) {

    const [fecha, setFecha] = useState(fechaInicial ?? "");
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState<TipoFestivo>("FESTIVO");
    const [todas, setTodas] = useState(true);
    const [dependenciasSeleccionadas, setDependenciasSeleccionadas] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        if (fechaInicial) setFecha(fechaInicial);

    }, [fechaInicial]);

    function toggleDependencia(dep: string) {

        setDependenciasSeleccionadas((prev) =>
            prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]
        );

    }

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        if (!fecha) {
            alert("Debe seleccionar una fecha.");
            return;
        }

        if (!nombre.trim()) {
            alert("Debe ingresar un nombre.");
            return;
        }

        setSaving(true);

        const ok = await onSave({
            fecha,
            nombre: nombre.trim(),
            tipo,
            dependencias: todas ? [] : dependenciasSeleccionadas
        });

        setSaving(false);

        if (ok) {

            setNombre("");
            setTipo("FESTIVO");
            setTodas(true);
            setDependenciasSeleccionadas([]);

        }

    }

    return (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">

                <label className="text-sm text-gray-600">Fecha</label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="rounded-lg border p-2"
                />

            </div>

            <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre (ej. Día de la Independencia)"
                className="rounded-lg border p-2"
            />

            <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoFestivo)}
                className="rounded-lg border p-2"
            >

                <option value="FESTIVO">Festivo</option>
                <option value="EVENTO">Evento</option>

            </select>

            <div>

                <label className="mb-2 flex items-center gap-2 text-sm">

                    <input
                        type="checkbox"
                        checked={todas}
                        onChange={(e) => setTodas(e.target.checked)}
                    />

                    Aplica a todas las dependencias

                </label>

                {!todas && (

                    <div className="ml-6 flex flex-wrap gap-3">

                        {dependenciasDisponibles.map((dep) => (

                            <label key={dep} className="flex items-center gap-1 text-sm">

                                <input
                                    type="checkbox"
                                    checked={dependenciasSeleccionadas.includes(dep)}
                                    onChange={() => toggleDependencia(dep)}
                                />

                                {dep}

                            </label>

                        ))}

                    </div>

                )}

            </div>

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
