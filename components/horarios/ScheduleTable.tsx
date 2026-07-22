"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Schedule } from "@/types/schedule";

interface Props {

    schedules: Schedule[];

    loading: boolean;

    onEdit: (schedule: Schedule) => void;

    onDelete: (schedule: Schedule) => void;

}

function formatDias(dias: string[]): string {

    return dias
        .map((d) => d.charAt(0) + d.slice(1).toLowerCase())
        .join(", ");

}

export default function ScheduleTable({

    schedules,

    loading,

    onEdit,

    onDelete

}: Props) {

    if (loading) {

        return (

            <div className="rounded-2xl border bg-white p-10 text-center shadow">

                Cargando horarios...

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-2xl border bg-white shadow">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="p-4 text-left">Nombre</th>

                        <th className="text-left">Días</th>

                        <th className="text-left">Horario estándar</th>

                        <th className="text-left">Excepciones</th>

                        <th className="text-center">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {schedules.length === 0 ? (

                        <tr>

                            <td colSpan={5} className="p-8 text-center text-gray-500">

                                No existen horarios registrados.

                            </td>

                        </tr>

                    ) : (

                        schedules.map((schedule) => (

                            <tr key={schedule._id} className="border-t">

                                <td className="p-4 font-medium">{schedule.nombre}</td>

                                <td>{formatDias(schedule.dias)}</td>

                                <td>{schedule.horaEntrada} - {schedule.horaSalida}</td>

                                <td>

                                    <div className="flex flex-wrap gap-1">

                                        {schedule.excepciones.length === 0 ? (

                                            <span className="text-gray-400">-</span>

                                        ) : (

                                            schedule.excepciones.map((exc, idx) => (

                                                <span
                                                    key={idx}
                                                    className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
                                                >
                                                    {exc.dia.charAt(0) + exc.dia.slice(1).toLowerCase()}: {exc.horaEntrada}-{exc.horaSalida}
                                                </span>

                                            ))

                                        )}

                                    </div>

                                </td>

                                <td>

                                    <div className="flex justify-center gap-3">

                                        <button onClick={() => onEdit(schedule)}>

                                            <Pencil size={18} className="text-green-600" />

                                        </button>

                                        <button onClick={() => onDelete(schedule)}>

                                            <Trash2 size={18} className="text-red-600" />

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
