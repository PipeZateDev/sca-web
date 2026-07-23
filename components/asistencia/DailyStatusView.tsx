"use client";

import { useMemo } from "react";

import Section from "@/components/ui/Section";
import EstadoBadge from "./EstadoBadge";
import { EmployeeDayStatus } from "@/types/attendanceStatus";
import { useDailyStatus } from "@/hooks/useDailyStatus";
import { AttendanceEstado } from "@/lib/scheduleEngine";

interface Props {
    fecha: string;
    onFechaChange: (fecha: string) => void;
    estudiantes?: boolean;
    filtroEstado?: AttendanceEstado;
    onFiltroEstadoChange?: (estado: AttendanceEstado | undefined) => void;
}

const SIN_HORARIO = "Sin horario asignado";

const ETIQUETA_FILTRO: Record<string, string> = {
    TARDANZA: "Tardanzas",
    AUSENTE: "Ausencias"
};

const FILA_POR_ESTADO: Record<string, string> = {
    TARDANZA: "bg-orange-50",
    AUSENTE: "bg-red-50"
};

export default function DailyStatusView({
    fecha,
    onFechaChange,
    estudiantes = false,
    filtroEstado,
    onFiltroEstadoChange
}: Props) {

    const { estados, loading } = useDailyStatus(fecha, estudiantes);

    const visibles = useMemo(
        () => estados.filter((e) => e.estado !== "DOMINICAL"),
        [estados]
    );

    const esDomingoSinEvento =
        !loading && estados.length > 0 && visibles.length === 0;

    const filtrados = useMemo(
        () => (filtroEstado ? visibles.filter((e) => e.estado === filtroEstado) : visibles),
        [visibles, filtroEstado]
    );

    const grupos = useMemo(() => {

        const mapa = new Map<string, EmployeeDayStatus[]>();

        for (const estado of filtrados) {

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

    }, [filtrados]);

    return (

        <div>

            <div className="mb-6 flex flex-wrap items-center gap-3">

                <label className="text-sm text-gray-600">Fecha</label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => onFechaChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />

                {filtroEstado && (

                    <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">

                        Mostrando solo: {ETIQUETA_FILTRO[filtroEstado] ?? filtroEstado}

                        {onFiltroEstadoChange && (

                            <button
                                onClick={() => onFiltroEstadoChange(undefined)}
                                className="font-medium text-green-700 hover:underline"
                            >
                                Ver todos
                            </button>

                        )}

                    </span>

                )}

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

            ) : filtrados.length === 0 ? (

                <div className="rounded-2xl border bg-white p-10 text-center text-gray-500 shadow">
                    Nadie con estado &quot;{ETIQUETA_FILTRO[filtroEstado ?? ""] ?? filtroEstado}&quot; este día.
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

                                            <tr
                                                key={estado.empleadoId}
                                                className={`border-t ${FILA_POR_ESTADO[estado.estado] ?? ""}`}
                                            >

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
