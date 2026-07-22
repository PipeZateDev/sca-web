"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";
import { exportElementToPdf } from "@/lib/pdfExport";

const COLORES_ESTADO: Record<string, string> = {
    "A tiempo": "#16A34A",
    "Tardanza": "#F59E0B",
    "Ausente": "#DC2626"
};

interface Props {
    desde: string;
    hasta: string;
    loading: boolean;
    estadosPersonal: EmployeeDayStatus[];
    horasPersonal: EmployeeWeekSummary[];
    estadosEstudiantes: EmployeeDayStatus[];
}

function formatFechaCorta(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function distribucionDeEstados(estados: EmployeeDayStatus[]) {

    const aTiempo = estados.filter((e) => e.estado === "A_TIEMPO").length;
    const tardanza = estados.filter((e) => e.estado === "TARDANZA").length;
    const ausente = estados.filter((e) => e.estado === "AUSENTE").length;

    return [
        { name: "A tiempo", value: aTiempo },
        { name: "Tardanza", value: tardanza },
        { name: "Ausente", value: ausente }
    ].filter((d) => d.value > 0);

}

export default function GraficasReport({
    desde,
    hasta,
    loading,
    estadosPersonal,
    horasPersonal,
    estadosEstudiantes
}: Props) {

    const [exportando, setExportando] = useState(false);

    const distribucionPersonal = useMemo(
        () => distribucionDeEstados(estadosPersonal),
        [estadosPersonal]
    );

    const distribucionEstudiantes = useMemo(
        () => distribucionDeEstados(estadosEstudiantes.filter((e) => e.estado !== "DOMINICAL")),
        [estadosEstudiantes]
    );

    const porHorario = useMemo(() => {

        const mapa = new Map<string, { horario: string; tardanzas: number; ausencias: number; horas: number }>();

        for (const item of horasPersonal) {

            const clave = item.horarioNombre ?? "Sin asignar";

            if (!mapa.has(clave)) {
                mapa.set(clave, { horario: clave, tardanzas: 0, ausencias: 0, horas: 0 });
            }

            const acumulado = mapa.get(clave)!;

            acumulado.tardanzas += item.tardanzas;
            acumulado.ausencias += item.ausencias;
            acumulado.horas += item.minutosTotales / 60;

        }

        return Array.from(mapa.values())
            .sort((a, b) => a.horario.localeCompare(b.horario))
            .map((d) => ({ ...d, horas: Math.round(d.horas * 10) / 10 }));

    }, [horasPersonal]);

    async function handleExportPdf() {

        setExportando(true);

        try {

            await exportElementToPdf(
                "reporte-graficas-pdf",
                `reporte_grafico_${desde}_${hasta}.pdf`
            );

        } catch (error) {

            console.error(error);
            toast.error("No fue posible generar el PDF.");

        } finally {

            setExportando(false);

        }

    }

    if (loading) {
        return (
            <div className="rounded-2xl border bg-white p-10 text-center shadow">
                Cargando...
            </div>
        );
    }

    return (

        <div>

            <div className="mb-4 flex justify-end">

                <button
                    onClick={handleExportPdf}
                    disabled={exportando}
                    className="rounded-lg border border-green-700 px-5 py-2 font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                >
                    {exportando ? "Generando..." : "Descargar PDF"}
                </button>

            </div>

            <div id="reporte-graficas-pdf" className="rounded-2xl border bg-white p-8 shadow">

                <div className="mb-8 flex flex-col items-center gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">

                    <img
                        src="/logo/logo-horizontal.png"
                        alt="Colegio Nuevo San Luis Gonzaga"
                        className="h-14 w-auto"
                    />

                    <div className="text-center text-sm text-gray-500 sm:text-right">
                        <p className="font-semibold text-gray-800">Reporte gráfico de asistencia</p>
                        <p>Periodo: {formatFechaCorta(desde)} — {formatFechaCorta(hasta)}</p>
                        <p>Generado: {new Date().toLocaleString("es-CO")}</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                    <div>

                        <h3 className="mb-3 font-semibold text-gray-700">Distribución de estados — Personal</h3>

                        {distribucionPersonal.length === 0 ? (

                            <p className="text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                        ) : (

                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={distribucionPersonal} dataKey="value" nameKey="name" outerRadius={90} label>
                                        {distribucionPersonal.map((entry) => (
                                            <Cell key={entry.name} fill={COLORES_ESTADO[entry.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                        )}

                    </div>

                    <div>

                        <h3 className="mb-3 font-semibold text-gray-700">Distribución de estados — Estudiantes</h3>

                        {distribucionEstudiantes.length === 0 ? (

                            <p className="text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                        ) : (

                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={distribucionEstudiantes} dataKey="value" nameKey="name" outerRadius={90} label>
                                        {distribucionEstudiantes.map((entry) => (
                                            <Cell key={entry.name} fill={COLORES_ESTADO[entry.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                        )}

                    </div>

                    <div className="lg:col-span-2">

                        <h3 className="mb-3 font-semibold text-gray-700">Tardanzas y ausencias por horario</h3>

                        {porHorario.length === 0 ? (

                            <p className="text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                        ) : (

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={porHorario}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="horario" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="tardanzas" name="Tardanzas" fill="#F59E0B" />
                                    <Bar dataKey="ausencias" name="Ausencias" fill="#DC2626" />
                                </BarChart>
                            </ResponsiveContainer>

                        )}

                    </div>

                    <div className="lg:col-span-2">

                        <h3 className="mb-3 font-semibold text-gray-700">Horas trabajadas por horario</h3>

                        {porHorario.length === 0 ? (

                            <p className="text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                        ) : (

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={porHorario}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="horario" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value} h`} />
                                    <Bar dataKey="horas" name="Horas trabajadas" fill="#0B4F8A" />
                                </BarChart>
                            </ResponsiveContainer>

                        )}

                    </div>

                </div>

                <p className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
                    Colegio Nuevo San Luis Gonzaga — Sistema de Control de Asistencia
                </p>

            </div>

        </div>

    );

}
