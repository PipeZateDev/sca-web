"use client";

import { useMemo } from "react";

import Section from "@/components/ui/Section";
import EstadoBadge from "./EstadoBadge";
import { EmployeeDayStatus } from "@/types/attendanceStatus";
import { useDailyStatus } from "@/hooks/useDailyStatus";

interface Props {
    fecha: string;
    onFechaChange: (fecha: string) => void;
    estudiantes?: boolean;
}

const SIN_HORARIO = "Sin horario asignado";

export default function DailyStatusView({ fecha, onFechaChange, estudiantes = false }: Props) {

    const { estados, loading } = useDailyStatus(fecha, estudiantes);

    const visibles = useMemo(
        () => estados.filter((e) => e.estado !== "DOMINICAL"),
        [estados]
    );

    const esDomingoSinEvento =
        !loading && estados.length > 0 && visibles.length === 0;

    const grupos = useMemo(() => {

        const mapa = new Map<string, EmployeeDayStatus[]>();

        for (const estado of visibles) {

            const clave = estado.horarioNombre ?? SIN_HORARIO;

            if (!mapa.has(clave)) mapa.set(clave, []);

            mapa.get(clave)!.push(estado);

        }

        for (const lista of mapa.values()) {

            lista.sort(
                (a, b) =>
                    (a.horaEsperada ?? "99:99").localeCompare(b.horaEsperada ?? "99:99") ||
                    a.nombreCompleto.localeCompare(b.nombreCompleto)
            );

        }

        return Array.from(mapa.entries()).sort(([a], [b]) => {

            if (a === SIN_HORARIO) return 1;
            if (b === SIN_HORARIO) return -1;

            return a.localeCompare(b);

        });

    }, [visibles]);

    return (

        <div>

            <div className="mb-6 flex items-center gap-3">

                <label className="text-sm text-gray-600">Fecha</label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => onFechaChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />

            </div>

            {loading ? (

                <div className="rounded-2xl border bg-white p-10 text-center shadow">
                    Cargando...
                </div>

            ) : estados.length === 0 ? (

                <div className="rounded-2xl border bg-white p-10 text-center text-gray-500 shadow">
                    {estudiantes ? "No hay estudiantes activos." : "No hay empleados activos."}
                </div>

            ) : esDomingoSinEvento ? (

                <div className="rounded-2xl border bg-blue-50 p-10 text-center text-blue-600 shadow">
                    Domingo — Dominical. No hay asistencia laboral programada para este día.
                </div>

            ) : (

                grupos.map(([nombreGrupo, lista]) => {

                    const aTiempo = lista.filter((e) => e.estado === "A_TIEMPO").length;
                    const tardanzas = lista.filter((e) => e.estado === "TARDANZA").length;
                    const ausentes = lista.filter((e) => e.estado === "AUSENTE").length;

                    return (

                        <Section
                            key={nombreGrupo}
                            title={`${nombreGrupo} — ${aTiempo} a tiempo · ${tardanzas} tardanza(s) · ${ausentes} ausente(s)`}
                        >

                            <div className="overflow-x-auto rounded-2xl border bg-white shadow">

                                <table className="w-full">

                                    <thead className="bg-slate-100">

                                        <tr>

                                            <th className="p-4 text-left">{estudiantes ? "Estudiante" : "Empleado"}</th>
                                            <th className="text-left">Hora esperada</th>
                                            <th className="text-left">Entrada</th>
                                            <th className="text-left">Salida</th>
                                            <th className="text-left">Marcaciones</th>
                                            <th className="text-left">Estado</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {lista.map((estado) => (

                                            <tr key={estado.empleadoId} className="border-t">

                                                <td className="p-4">{estado.nombreCompleto}</td>

                                                <td>{estado.horaEsperada ?? "-"}</td>

                                                <td>{estado.entrada ?? "-"}</td>

                                                <td>{estado.salida ?? "-"}</td>

                                                <td>

                                                    <div className="flex flex-wrap gap-1">

                                                        {estado.marcaciones.map((hora, idx) => (

                                                            <span
                                                                key={idx}
                                                                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                                                            >
                                                                {hora}
                                                            </span>

                                                        ))}

                                                    </div>

                                                </td>

                                                <td>

                                                    <EstadoBadge estado={estado.estado} />

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </Section>

                    );

                })

            )}

        </div>

    );

}
