"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import PageTitle from "@/components/ui/PageTitle";
import EstadoBadge from "@/components/asistencia/EstadoBadge";
import ReportTabs, { ReportTab } from "@/components/reportes/ReportTabs";

import { AttendanceRecord } from "@/types/attendance";
import { Employee } from "@/types/employee";
import { Holiday } from "@/types/holiday";
import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";
import { aMinutos } from "@/lib/scheduleEngine";
import { toCSV, downloadCSV, CsvColumn } from "@/lib/csv";

const NECESITA_RANGO: Record<ReportTab, boolean> = {
    asistencia: true,
    tardanzas: true,
    ausencias: true,
    horas: true,
    empleados: false,
    horarios: false,
    festivos: false
};

function isoDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
}

function isoToday(): string {
    return new Date().toISOString().slice(0, 10);
}

function formatFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString("es-CO");
}

function formatHoras(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
}

export default function ReportesContent() {

    const [tab, setTab] = useState<ReportTab>("asistencia");
    const [desde, setDesde] = useState(isoDaysAgo(30));
    const [hasta, setHasta] = useState(isoToday());
    const [loading, setLoading] = useState(false);

    const [asistencia, setAsistencia] = useState<AttendanceRecord[]>([]);
    const [estados, setEstados] = useState<EmployeeDayStatus[]>([]);
    const [horas, setHoras] = useState<EmployeeWeekSummary[]>([]);
    const [empleados, setEmpleados] = useState<Employee[]>([]);
    const [festivos, setFestivos] = useState<Holiday[]>([]);

    useEffect(() => {

        let cancelado = false;

        async function cargar() {

            setLoading(true);

            try {

                if (tab === "asistencia") {

                    const res = await fetch(`/api/asistencias?desde=${desde}&hasta=${hasta}`);
                    const data = await res.json();
                    if (!cancelado) setAsistencia(Array.isArray(data) ? data : []);

                } else if (tab === "tardanzas" || tab === "ausencias") {

                    const res = await fetch(`/api/reportes/estados?desde=${desde}&hasta=${hasta}`);
                    const data = await res.json();
                    if (!cancelado) setEstados(Array.isArray(data) ? data : []);

                } else if (tab === "horas") {

                    const res = await fetch(`/api/reportes/horas?desde=${desde}&hasta=${hasta}`);
                    const data = await res.json();
                    if (!cancelado) setHoras(Array.isArray(data) ? data : []);

                } else if (tab === "empleados" || tab === "horarios") {

                    const res = await fetch("/api/empleados");
                    const data = await res.json();
                    if (!cancelado) setEmpleados(Array.isArray(data) ? data : []);

                } else if (tab === "festivos") {

                    const res = await fetch("/api/festivos");
                    const data = await res.json();
                    if (!cancelado) setFestivos(Array.isArray(data) ? data : []);

                }

            } catch (err) {

                console.error(err);
                toast.error("No fue posible cargar el reporte.");

            } finally {

                if (!cancelado) setLoading(false);

            }

        }

        cargar();

        return () => { cancelado = true; };

    }, [tab, desde, hasta]);

    const tardanzas = useMemo(
        () => estados.filter((e) => e.estado === "TARDANZA"),
        [estados]
    );

    const ausencias = useMemo(
        () => estados.filter((e) => e.estado === "AUSENTE"),
        [estados]
    );

    const horariosAgrupados = useMemo(() => {

        const mapa = new Map<string, Employee[]>();

        for (const e of empleados) {

            const clave = e.horario || "Sin horario asignado";

            if (!mapa.has(clave)) mapa.set(clave, []);

            mapa.get(clave)!.push(e);

        }

        return Array.from(mapa.entries()).sort(([a], [b]) => a.localeCompare(b));

    }, [empleados]);

    function handleExport() {

        let rows: Record<string, unknown>[] = [];
        let columns: CsvColumn[] = [];
        let filename = "reporte.csv";

        if (tab === "asistencia") {

            columns = [
                { key: "fecha", label: "Fecha" },
                { key: "nombreArchivo", label: "Empleado" },
                { key: "departamentoArchivo", label: "Dependencia" },
                { key: "entrada", label: "Entrada" },
                { key: "salida", label: "Salida" }
            ];
            rows = asistencia.map((r) => ({ ...r, fecha: formatFecha(r.fecha) }));
            filename = `asistencia_${desde}_${hasta}.csv`;

        } else if (tab === "tardanzas") {

            columns = [
                { key: "fecha", label: "Fecha" },
                { key: "nombreCompleto", label: "Empleado" },
                { key: "horarioNombre", label: "Horario" },
                { key: "horaEsperada", label: "Hora esperada" },
                { key: "entrada", label: "Entrada real" }
            ];
            rows = tardanzas.map((r) => ({ ...r, fecha: formatFecha(r.fecha) }));
            filename = `tardanzas_${desde}_${hasta}.csv`;

        } else if (tab === "ausencias") {

            columns = [
                { key: "fecha", label: "Fecha" },
                { key: "nombreCompleto", label: "Empleado" },
                { key: "horarioNombre", label: "Horario" },
                { key: "horaEsperada", label: "Hora esperada" }
            ];
            rows = ausencias.map((r) => ({ ...r, fecha: formatFecha(r.fecha) }));
            filename = `ausencias_${desde}_${hasta}.csv`;

        } else if (tab === "horas") {

            columns = [
                { key: "nombreCompleto", label: "Empleado" },
                { key: "horarioNombre", label: "Horario" },
                { key: "horasTexto", label: "Horas trabajadas" },
                { key: "tardanzas", label: "Tardanzas" },
                { key: "ausencias", label: "Ausencias" }
            ];
            rows = horas.map((r) => ({ ...r, horasTexto: formatHoras(r.minutosTotales) }));
            filename = `horas_trabajadas_${desde}_${hasta}.csv`;

        } else if (tab === "empleados" || tab === "horarios") {

            columns = [
                { key: "documento", label: "Documento" },
                { key: "nombreCompleto", label: "Nombre" },
                { key: "cargo", label: "Cargo" },
                { key: "dependencia", label: "Dependencia" },
                { key: "horario", label: "Horario" },
                { key: "estado", label: "Estado" }
            ];
            rows = empleados as unknown as Record<string, unknown>[];
            filename = "empleados.csv";

        } else if (tab === "festivos") {

            columns = [
                { key: "fecha", label: "Fecha" },
                { key: "nombre", label: "Nombre" },
                { key: "tipo", label: "Tipo" },
                { key: "horariosTexto", label: "Horarios" }
            ];
            rows = festivos.map((f) => ({
                ...f,
                fecha: formatFecha(f.fecha),
                horariosTexto: f.horarios.length === 0 ? "Todos" : f.horarios.join(", ")
            }));
            filename = "festivos.csv";

        }

        downloadCSV(filename, toCSV(rows, columns));

    }

    return (

        <>

            <PageTitle
                title="Reportes"
                subtitle="Consulta y exporta la información de asistencia, tardanzas, ausencias y más"
            />

            <ReportTabs tab={tab} onChange={setTab} />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

                {NECESITA_RANGO[tab] ? (

                    <div className="flex items-end gap-3">

                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-gray-600">Desde</label>

                            <input
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2"
                            />

                        </div>

                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-gray-600">Hasta</label>

                            <input
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2"
                            />

                        </div>

                    </div>

                ) : (

                    <div />

                )}

                <button
                    onClick={handleExport}
                    className="rounded-lg border border-green-700 px-5 py-2 font-medium text-green-700 transition hover:bg-green-50"
                >
                    Exportar CSV
                </button>

            </div>

            {loading ? (

                <div className="rounded-2xl border bg-white p-10 text-center shadow">
                    Cargando...
                </div>

            ) : (

                <div className="overflow-hidden rounded-2xl border bg-white shadow">

                    <table className="w-full">

                        {tab === "asistencia" && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Fecha</th>
                                        <th className="text-left">Empleado</th>
                                        <th className="text-left">Dependencia</th>
                                        <th className="text-left">Entrada</th>
                                        <th className="text-left">Salida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistencia.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Sin registros en el rango seleccionado.</td></tr>
                                    ) : asistencia.map((r) => (
                                        <tr key={r._id} className="border-t">
                                            <td className="p-4">{formatFecha(r.fecha)}</td>
                                            <td>{r.nombreArchivo}</td>
                                            <td>{r.departamentoArchivo}</td>
                                            <td>{r.entrada ?? "-"}</td>
                                            <td>{r.salida ?? "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                        {(tab === "tardanzas" || tab === "ausencias") && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Fecha</th>
                                        <th className="text-left">Empleado</th>
                                        <th className="text-left">Horario</th>
                                        <th className="text-left">Hora esperada</th>
                                        {tab === "tardanzas" && <th className="text-left">Entrada real</th>}
                                        {tab === "tardanzas" && <th className="text-left">Minutos tarde</th>}
                                        <th className="text-left">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tab === "tardanzas" ? tardanzas : ausencias).length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Sin registros en el rango seleccionado.</td></tr>
                                    ) : (tab === "tardanzas" ? tardanzas : ausencias).map((r) => (
                                        <tr key={`${r.empleadoId}-${String(r.fecha)}`} className="border-t">
                                            <td className="p-4">{formatFecha(r.fecha)}</td>
                                            <td>{r.nombreCompleto}</td>
                                            <td>{r.horarioNombre ?? "-"}</td>
                                            <td>{r.horaEsperada ?? "-"}</td>
                                            {tab === "tardanzas" && <td>{r.entrada ?? "-"}</td>}
                                            {tab === "tardanzas" && (
                                                <td>
                                                    {r.entrada && r.horaEsperada
                                                        ? aMinutos(r.entrada) - aMinutos(r.horaEsperada)
                                                        : "-"}
                                                </td>
                                            )}
                                            <td><EstadoBadge estado={r.estado} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                        {tab === "horas" && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Empleado</th>
                                        <th className="text-left">Horario</th>
                                        <th className="text-left">Horas trabajadas</th>
                                        <th className="text-left">Tardanzas</th>
                                        <th className="text-left">Ausencias</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {horas.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Sin datos en el rango seleccionado.</td></tr>
                                    ) : horas.map((r) => (
                                        <tr key={r.empleadoId} className="border-t">
                                            <td className="p-4">{r.nombreCompleto}</td>
                                            <td>{r.horarioNombre ?? "Sin asignar"}</td>
                                            <td>{formatHoras(r.minutosTotales)}</td>
                                            <td>{r.tardanzas}</td>
                                            <td>{r.ausencias}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                        {tab === "empleados" && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Documento</th>
                                        <th className="text-left">Nombre</th>
                                        <th className="text-left">Cargo</th>
                                        <th className="text-left">Dependencia</th>
                                        <th className="text-left">Horario</th>
                                        <th className="text-left">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {empleados.map((e) => (
                                        <tr key={e._id} className="border-t">
                                            <td className="p-4">{e.documento}</td>
                                            <td>{e.nombreCompleto}</td>
                                            <td>{e.cargo}</td>
                                            <td>{e.dependencia}</td>
                                            <td>{e.horario || "-"}</td>
                                            <td>{e.estado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                        {tab === "horarios" && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Horario</th>
                                        <th className="text-left">Empleados asignados</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {horariosAgrupados.map(([nombreHorario, lista]) => (
                                        <tr key={nombreHorario} className="border-t align-top">
                                            <td className="p-4 font-medium">{nombreHorario}</td>
                                            <td>{lista.map((e) => e.nombreCompleto).join(", ")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                        {tab === "festivos" && (

                            <>
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-4 text-left">Fecha</th>
                                        <th className="text-left">Nombre</th>
                                        <th className="text-left">Tipo</th>
                                        <th className="text-left">Horarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {festivos.map((f) => (
                                        <tr key={f._id} className="border-t">
                                            <td className="p-4">{formatFecha(f.fecha)}</td>
                                            <td>{f.nombre}</td>
                                            <td>{f.tipo === "FESTIVO" ? "Festivo" : "Evento"}</td>
                                            <td>{f.horarios.length === 0 ? "Todos" : f.horarios.join(", ")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>

                        )}

                    </table>

                </div>

            )}

        </>

    );

}
