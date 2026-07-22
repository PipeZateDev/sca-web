"use client";

import { useState } from "react";

import { useWeeklySummary, fetchEmployeeWeekDetail } from "@/hooks/useWeeklySummary";
import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";
import EmployeeWeekDetailModal from "./EmployeeWeekDetailModal";

interface Props {
    inicioISO: string;
    onInicioChange: (value: string) => void;
    estudiantes?: boolean;
}

function formatHoras(minutos: number): string {

    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    return `${horas}h ${mins}m`;

}

export default function WeeklySummaryView({ inicioISO, onInicioChange, estudiantes = false }: Props) {

    const { resumen, loading } = useWeeklySummary(inicioISO, estudiantes);

    const [selected, setSelected] = useState<EmployeeWeekSummary | null>(null);
    const [detalle, setDetalle] = useState<EmployeeDayStatus[]>([]);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    async function handleSelect(item: EmployeeWeekSummary) {

        setSelected(item);
        setLoadingDetalle(true);

        try {

            const data = await fetchEmployeeWeekDetail(item.empleadoId, inicioISO, estudiantes);

            setDetalle(data);

        } finally {

            setLoadingDetalle(false);

        }

    }

    return (

        <div>

            <div className="mb-6 flex items-center gap-3">

                <label className="text-sm text-gray-600">Semana de</label>

                <input
                    type="date"
                    value={inicioISO}
                    onChange={(e) => onInicioChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />

            </div>

            {loading ? (

                <div className="rounded-2xl border bg-white p-10 text-center shadow">
                    Cargando...
                </div>

            ) : (

                <div className="overflow-x-auto rounded-2xl border bg-white shadow">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="p-4 text-left">{estudiantes ? "Estudiante" : "Empleado"}</th>
                                <th className="text-left">Horario</th>
                                <th className="text-left">Horas trabajadas</th>
                                <th className="text-left">Tardanzas</th>
                                <th className="text-left">Ausencias</th>

                            </tr>

                        </thead>

                        <tbody>

                            {resumen.length === 0 ? (

                                <tr>

                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        {estudiantes ? "No hay estudiantes activos." : "No hay empleados activos."}
                                    </td>

                                </tr>

                            ) : (

                                resumen.map((item) => (

                                    <tr
                                        key={item.empleadoId}
                                        onClick={() => handleSelect(item)}
                                        className="cursor-pointer border-t transition hover:bg-slate-50"
                                    >

                                        <td className="p-4">{item.nombreCompleto}</td>

                                        <td>{item.horarioNombre ?? "Sin asignar"}</td>

                                        <td>{formatHoras(item.minutosTotales)}</td>

                                        <td>

                                            {item.tardanzas > 0 ? (
                                                <span className="font-medium text-amber-700">{item.tardanzas}</span>
                                            ) : (
                                                item.tardanzas
                                            )}

                                        </td>

                                        <td>

                                            {item.ausencias > 0 ? (
                                                <span className="font-medium text-red-700">{item.ausencias}</span>
                                            ) : (
                                                item.ausencias
                                            )}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            )}

            <EmployeeWeekDetailModal
                open={!!selected}
                nombreCompleto={selected?.nombreCompleto ?? ""}
                loading={loadingDetalle}
                dias={detalle}
                onClose={() => setSelected(null)}
            />

        </div>

    );

}
