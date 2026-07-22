"use client";

import { useState } from "react";

import { DiaSemana, Schedule, ScheduleException } from "@/types/schedule";

interface Props {

    initialValue?: Schedule;

    onSave: (schedule: Partial<Schedule>) => Promise<boolean>;

    onCancel: () => void;

}

const DIAS: DiaSemana[] = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
    "DOMINGO"
];

const DIAS_LABORALES_DEFECTO: DiaSemana[] = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES"
];

function emptyException(): ScheduleException {
    return { dia: "JUEVES", horaEntrada: "", horaSalida: "" };
}

export default function ScheduleForm({

    initialValue,

    onSave,

    onCancel

}: Props) {

    const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
    const [dias, setDias] = useState<DiaSemana[]>(
        initialValue?.dias ?? DIAS_LABORALES_DEFECTO
    );
    const [horaEntrada, setHoraEntrada] = useState(initialValue?.horaEntrada ?? "");
    const [horaSalida, setHoraSalida] = useState(initialValue?.horaSalida ?? "");
    const [excepciones, setExcepciones] = useState<ScheduleException[]>(
        initialValue?.excepciones ?? []
    );
    const [saving, setSaving] = useState(false);

    function toggleDia(dia: DiaSemana) {

        setDias((prev) =>
            prev.includes(dia)
                ? prev.filter((d) => d !== dia)
                : [...prev, dia]
        );

    }

    function updateExcepcion(index: number, changes: Partial<ScheduleException>) {

        setExcepciones((prev) =>
            prev.map((exc, i) => (i === index ? { ...exc, ...changes } : exc))
        );

    }

    function removeExcepcion(index: number) {

        setExcepciones((prev) => prev.filter((_, i) => i !== index));

    }

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        if (!nombre.trim()) {
            alert("Debe ingresar el nombre del horario.");
            return;
        }

        if (!horaEntrada || !horaSalida) {
            alert("Debe ingresar la hora de entrada y salida estándar.");
            return;
        }

        setSaving(true);

        const ok = await onSave({
            nombre: nombre.trim().toUpperCase(),
            dias,
            horaEntrada,
            horaSalida,
            excepciones
        });

        setSaving(false);

        if (ok && !initialValue) {

            setNombre("");
            setDias(DIAS_LABORALES_DEFECTO);
            setHoraEntrada("");
            setHoraSalida("");
            setExcepciones([]);

        }

    }

    return (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del horario (ej. PROFESORES)"
                className="border rounded-lg p-2"
            />

            <div>

                <p className="mb-2 text-sm text-gray-600">Días laborales</p>

                <div className="flex flex-wrap gap-3">

                    {DIAS.map((dia) => (

                        <label key={dia} className="flex items-center gap-1 text-sm">

                            <input
                                type="checkbox"
                                checked={dias.includes(dia)}
                                onChange={() => toggleDia(dia)}
                            />

                            {dia.charAt(0) + dia.slice(1).toLowerCase()}

                        </label>

                    ))}

                </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">

                    <label className="text-sm text-gray-600">Hora entrada</label>

                    <input
                        type="time"
                        value={horaEntrada}
                        onChange={(e) => setHoraEntrada(e.target.value)}
                        className="border rounded-lg p-2"
                    />

                </div>

                <div className="flex flex-col gap-1">

                    <label className="text-sm text-gray-600">Hora salida</label>

                    <input
                        type="time"
                        value={horaSalida}
                        onChange={(e) => setHoraSalida(e.target.value)}
                        className="border rounded-lg p-2"
                    />

                </div>

            </div>

            <div>

                <div className="mb-2 flex items-center justify-between">

                    <p className="text-sm text-gray-600">Excepciones por día</p>

                    <button
                        type="button"
                        onClick={() => setExcepciones((prev) => [...prev, emptyException()])}
                        className="text-sm text-green-700 hover:underline"
                    >
                        + Agregar excepción
                    </button>

                </div>

                {excepciones.map((exc, index) => (

                    <div key={index} className="mb-2 grid grid-cols-4 items-center gap-2">

                        <select
                            value={exc.dia}
                            onChange={(e) =>
                                updateExcepcion(index, { dia: e.target.value as DiaSemana })
                            }
                            className="border rounded-lg p-2"
                        >

                            {DIAS.map((dia) => (
                                <option key={dia} value={dia}>
                                    {dia.charAt(0) + dia.slice(1).toLowerCase()}
                                </option>
                            ))}

                        </select>

                        <input
                            type="time"
                            value={exc.horaEntrada}
                            onChange={(e) =>
                                updateExcepcion(index, { horaEntrada: e.target.value })
                            }
                            className="border rounded-lg p-2"
                        />

                        <input
                            type="time"
                            value={exc.horaSalida}
                            onChange={(e) =>
                                updateExcepcion(index, { horaSalida: e.target.value })
                            }
                            className="border rounded-lg p-2"
                        />

                        <button
                            type="button"
                            onClick={() => removeExcepcion(index)}
                            className="text-red-600 hover:underline"
                        >
                            Quitar
                        </button>

                    </div>

                ))}

            </div>

            <div className="flex justify-end gap-3 mt-2">

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {saving ? "Guardando..." : "Guardar"}
                </button>

            </div>

        </form>

    );

}
