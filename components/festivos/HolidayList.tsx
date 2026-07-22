"use client";

import { Trash2 } from "lucide-react";

import { Holiday } from "@/types/holiday";

interface Props {
    holidays: Holiday[];
    loading: boolean;
    onDelete: (holiday: Holiday) => void;
}

function formatFecha(fecha: Date | string): string {

    return new Date(fecha).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}

export default function HolidayList({ holidays, loading, onDelete }: Props) {

    if (loading) {

        return (

            <div className="rounded-2xl border bg-white p-10 text-center shadow">
                Cargando festivos...
            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-2xl border bg-white shadow">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="p-4 text-left">Fecha</th>
                        <th className="text-left">Nombre</th>
                        <th className="text-left">Tipo</th>
                        <th className="text-left">Horarios</th>
                        <th className="text-center">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {holidays.length === 0 ? (

                        <tr>

                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                No hay festivos ni eventos registrados.
                            </td>

                        </tr>

                    ) : (

                        holidays.map((holiday) => (

                            <tr key={holiday._id} className="border-t">

                                <td className="p-4">{formatFecha(holiday.fecha)}</td>

                                <td>{holiday.nombre}</td>

                                <td>

                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            holiday.tipo === "FESTIVO"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {holiday.tipo === "FESTIVO" ? "Festivo" : "Evento"}
                                    </span>

                                </td>

                                <td>

                                    {holiday.horarios.length === 0
                                        ? "Todos"
                                        : holiday.horarios.join(", ")}

                                </td>

                                <td className="text-center">

                                    <button
                                        onClick={() => onDelete(holiday)}
                                        className="rounded-full p-2 text-red-600 transition-all duration-150 hover:scale-110 hover:bg-red-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}
