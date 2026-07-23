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
    Legend,
    LabelList
} from "recharts";

import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";
import { exportElementToPdf } from "@/lib/pdfExport";
import { fechaHoraBogotaTexto } from "@/lib/timezone";
import { useIsMobile } from "@/hooks/useIsMobile";
import { imprimirConOrientacion } from "@/lib/printOrientation";
import Modal from "@/components/ui/Modal";

type TipoVisualizacion = "circular" | "barras" | "tabla";
type DatoCircular = "personal" | "estudiantes";
type DatoBarras = "tardanzas" | "ausencias" | "horas";

const COLOR_BARRA: Record<DatoBarras, string> = {
    tardanzas: "#F59E0B",
    ausencias: "#DC2626",
    horas: "#0B4F8A"
};

const NOMBRE_BARRA: Record<DatoBarras, string> = {
    tardanzas: "Tardanzas",
    ausencias: "Ausencias",
    horas: "Horas trabajadas"
};

// Ocultos por ahora a pedido del usuario; se deja el botón/opción y la lógica
// listos para reactivarlos simplemente poniendo esto en true.
const MOSTRAR_DESCARGAR_PDF = false;
const MOSTRAR_CIRCULAR = false;

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

interface FilaEmpleado {
    id: string;
    nombre: string;
    horario: string;
    tardanzas: number;
    ausencias: number;
    horas: number;
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

const TODAS = "";

export default function GraficasReport({
    desde,
    hasta,
    loading,
    estadosPersonal,
    horasPersonal,
    estadosEstudiantes
}: Props) {

    const esMovil = useIsMobile();

    const [exportando, setExportando] = useState(false);
    const [mostrarSelectorImpresion, setMostrarSelectorImpresion] = useState(false);
    const [tipoVisualizacion, setTipoVisualizacion] = useState<TipoVisualizacion>(
        MOSTRAR_CIRCULAR ? "circular" : "barras"
    );
    const [datoCircular, setDatoCircular] = useState<DatoCircular>("personal");
    const [datoBarras, setDatoBarras] = useState<DatoBarras>("tardanzas");
    const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState(TODAS);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(TODAS);

    const dependenciasDisponibles = useMemo(() => {

        const set = new Set<string>();

        horasPersonal.forEach((h) => { if (h.dependencia) set.add(h.dependencia); });
        estadosEstudiantes.forEach((e) => { if (e.dependencia) set.add(e.dependencia); });

        return Array.from(set).sort();

    }, [horasPersonal, estadosEstudiantes]);

    const empleadosDisponibles = useMemo(() => {

        const mapa = new Map<string, { id: string; nombre: string; dependencia: string }>();

        horasPersonal.forEach((h) => {
            mapa.set(h.empleadoId, { id: h.empleadoId, nombre: h.nombreCompleto, dependencia: h.dependencia });
        });

        estadosEstudiantes.forEach((e) => {
            if (!mapa.has(e.empleadoId)) {
                mapa.set(e.empleadoId, { id: e.empleadoId, nombre: e.nombreCompleto, dependencia: e.dependencia });
            }
        });

        let lista = Array.from(mapa.values());

        if (dependenciaSeleccionada) {
            lista = lista.filter((e) => e.dependencia === dependenciaSeleccionada);
        }

        return lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

    }, [horasPersonal, estadosEstudiantes, dependenciaSeleccionada]);

    function handleDependenciaChange(valor: string) {

        setDependenciaSeleccionada(valor);

        const sigueDisponible = empleadosDisponibles.some(
            (e) => e.id === empleadoSeleccionado && (!valor || e.dependencia === valor)
        );

        if (!sigueDisponible) {
            setEmpleadoSeleccionado(TODAS);
        }

    }

    function coincide<T extends { dependencia: string; empleadoId: string }>(item: T): boolean {

        return (
            (!dependenciaSeleccionada || item.dependencia === dependenciaSeleccionada) &&
            (!empleadoSeleccionado || item.empleadoId === empleadoSeleccionado)
        );

    }

    const estadosPersonalFiltrado = useMemo(
        () => estadosPersonal.filter(coincide),
        [estadosPersonal, dependenciaSeleccionada, empleadoSeleccionado]
    );

    const horasPersonalFiltrado = useMemo(
        () => horasPersonal.filter(coincide),
        [horasPersonal, dependenciaSeleccionada, empleadoSeleccionado]
    );

    const estadosEstudiantesFiltrado = useMemo(
        () => estadosEstudiantes.filter(coincide),
        [estadosEstudiantes, dependenciaSeleccionada, empleadoSeleccionado]
    );

    const distribucionPersonal = useMemo(
        () => distribucionDeEstados(estadosPersonalFiltrado),
        [estadosPersonalFiltrado]
    );

    const distribucionEstudiantes = useMemo(
        () => distribucionDeEstados(estadosEstudiantesFiltrado.filter((e) => e.estado !== "DOMINICAL")),
        [estadosEstudiantesFiltrado]
    );

    // Cuando se muestran "todos" (sin filtrar a un único empleado), cada barra/fila
    // representa un empleado individual: eje X = empleado, eje Y = la métrica elegida.
    const porEmpleado = useMemo<FilaEmpleado[]>(() => {

        return horasPersonalFiltrado
            .map((item) => ({
                id: item.empleadoId,
                nombre: item.nombreCompleto,
                horario: item.horarioNombre ?? "Sin asignar",
                tardanzas: item.tardanzas,
                ausencias: item.ausencias,
                horas: Math.round((item.minutosTotales / 60) * 10) / 10
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

    }, [horasPersonalFiltrado]);

    const datosCircularActivo = datoCircular === "personal" ? distribucionPersonal : distribucionEstudiantes;

    const nombreFiltro = useMemo(() => {

        if (empleadoSeleccionado) {
            return empleadosDisponibles.find((e) => e.id === empleadoSeleccionado)?.nombre;
        }

        if (dependenciaSeleccionada) {
            return dependenciaSeleccionada;
        }

        return undefined;

    }, [empleadoSeleccionado, dependenciaSeleccionada, empleadosDisponibles]);

    const tituloVisualizacion = useMemo(() => {

        let titulo: string;

        if (tipoVisualizacion === "circular") {

            titulo = datoCircular === "personal"
                ? "Distribución de estados — Personal"
                : "Distribución de estados — Estudiantes";

        } else if (tipoVisualizacion === "barras") {

            titulo = `${NOMBRE_BARRA[datoBarras]} por empleado`;

        } else {

            titulo = "Tabla de datos por empleado";

        }

        return nombreFiltro ? `${titulo} — ${nombreFiltro}` : titulo;

    }, [tipoVisualizacion, datoCircular, datoBarras, nombreFiltro]);

    async function handleExportPdf() {

        setExportando(true);

        try {

            const sufijoFiltro = nombreFiltro
                ? `_${nombreFiltro.trim().toLowerCase().replace(/\s+/g, "_")}`
                : "";

            await exportElementToPdf(
                "reporte-graficas-pdf",
                `reporte_grafico_${desde}_${hasta}${sufijoFiltro}.pdf`
            );

        } catch (error) {

            console.error(error);
            toast.error("No fue posible generar el PDF.");

        } finally {

            setExportando(false);

        }

    }

    function handleImprimir() {

        setMostrarSelectorImpresion(true);

    }

    function handleSeleccionarOrientacion(orientacion: "portrait" | "landscape") {

        setMostrarSelectorImpresion(false);
        imprimirConOrientacion(orientacion);

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

            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">

                <div className="flex flex-wrap items-end gap-4">

                    <div className="flex flex-col gap-1">

                        <label className="text-sm text-gray-600">Tipo de gráfica</label>

                        <select
                            value={tipoVisualizacion}
                            onChange={(e) => setTipoVisualizacion(e.target.value as TipoVisualizacion)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            {MOSTRAR_CIRCULAR && (
                                <option value="circular">Circular (distribución de estados)</option>
                            )}
                            <option value="barras">Barras (comparación por empleado)</option>
                            <option value="tabla">Tabla de datos</option>
                        </select>

                    </div>

                    {tipoVisualizacion === "circular" && (

                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-gray-600">Datos a mostrar</label>

                            <select
                                value={datoCircular}
                                onChange={(e) => setDatoCircular(e.target.value as DatoCircular)}
                                className="rounded-lg border border-gray-300 px-4 py-2"
                            >
                                <option value="personal">Personal</option>
                                <option value="estudiantes">Estudiantes</option>
                            </select>

                        </div>

                    )}

                    {tipoVisualizacion !== "circular" && (

                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-gray-600">Datos a mostrar</label>

                            <select
                                value={datoBarras}
                                onChange={(e) => setDatoBarras(e.target.value as DatoBarras)}
                                className="rounded-lg border border-gray-300 px-4 py-2"
                            >
                                <option value="tardanzas">Tardanzas</option>
                                <option value="ausencias">Ausencias</option>
                                <option value="horas">Horas trabajadas</option>
                            </select>

                        </div>

                    )}

                    <div className="flex flex-col gap-1">

                        <label className="text-sm text-gray-600">Dependencia</label>

                        <select
                            value={dependenciaSeleccionada}
                            onChange={(e) => handleDependenciaChange(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value={TODAS}>Todas</option>
                            {dependenciasDisponibles.map((dep) => (
                                <option key={dep} value={dep}>{dep}</option>
                            ))}
                        </select>

                    </div>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm text-gray-600">Empleado</label>

                        <select
                            value={empleadoSeleccionado}
                            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value={TODAS}>Todos</option>
                            {empleadosDisponibles.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                            ))}
                        </select>

                    </div>

                </div>

                <div className="flex gap-2">

                    <button
                        onClick={handleImprimir}
                        className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-600 transition hover:bg-slate-50"
                    >
                        Imprimir
                    </button>

                    {MOSTRAR_DESCARGAR_PDF && (

                        <button
                            onClick={handleExportPdf}
                            disabled={exportando}
                            className="rounded-lg border border-green-700 px-5 py-2 font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                        >
                            {exportando ? "Generando..." : "Descargar PDF"}
                        </button>

                    )}

                </div>

            </div>

            <div id="reporte-graficas-pdf" data-print-area className="rounded-2xl border bg-white p-8 shadow">

                <div className="mb-8 flex flex-col items-center gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">

                    <img
                        src="/logo/logo-horizontal.png"
                        alt="Colegio Nuevo San Luis Gonzaga"
                        className="h-20 w-auto print:h-14"
                    />

                    <div className="text-center text-sm text-gray-500 sm:text-right">
                        <p className="font-semibold text-gray-800">Reporte gráfico de asistencia</p>
                        <p>Periodo: {formatFechaCorta(desde)} — {formatFechaCorta(hasta)}</p>
                        {nombreFiltro && <p>Filtro: {nombreFiltro}</p>}
                        <p>Generado: {fechaHoraBogotaTexto()}</p>
                    </div>

                </div>

                <h3 className="mb-4 text-center text-lg font-semibold text-gray-700">
                    {tituloVisualizacion}
                </h3>

                {tipoVisualizacion === "circular" && (

                    datosCircularActivo.length === 0 ? (

                        <p className="text-center text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                    ) : (

                        <ResponsiveContainer width="100%" height={340}>
                            <PieChart>
                                <Pie
                                    data={datosCircularActivo}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    label={(props) => `${props.name}: ${props.value}`}
                                >
                                    {datosCircularActivo.map((entry) => (
                                        <Cell key={entry.name} fill={COLORES_ESTADO[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                    )

                )}

                {tipoVisualizacion === "barras" && (

                    porEmpleado.length === 0 ? (

                        <p className="text-center text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                    ) : esMovil ? (

                        // Móvil: barras horizontales — cada empleado ocupa una fila propia
                        // (eje Y = empleado, eje X = cantidad), se lee de arriba a abajo
                        // en vez de tener que descifrar etiquetas verticales diminutas.
                        <ResponsiveContainer width="100%" height={Math.max(porEmpleado.length * 42, 220)}>
                            <BarChart data={porEmpleado} layout="vertical" margin={{ left: 8, right: 28 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={datoBarras === "horas"} tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="nombre" width={100} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={datoBarras === "horas" ? (v) => `${v} h` : undefined} />
                                <Bar dataKey={datoBarras} name={NOMBRE_BARRA[datoBarras]} fill={COLOR_BARRA[datoBarras]}>
                                    <LabelList
                                        dataKey={datoBarras}
                                        position="right"
                                        formatter={datoBarras === "horas" ? (v) => `${v}h` : undefined}
                                        style={{ fontSize: 10 }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    ) : (

                        // Escritorio: se ajusta siempre al ancho disponible de la ventana,
                        // sin scroll horizontal forzado.
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={porEmpleado} margin={{ bottom: 90 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="nombre"
                                    tick={{ fontSize: 11 }}
                                    angle={-40}
                                    textAnchor="end"
                                    interval={0}
                                    height={100}
                                />
                                <YAxis allowDecimals={datoBarras === "horas"} />
                                <Tooltip formatter={datoBarras === "horas" ? (v) => `${v} h` : undefined} />
                                <Bar dataKey={datoBarras} name={NOMBRE_BARRA[datoBarras]} fill={COLOR_BARRA[datoBarras]}>
                                    <LabelList
                                        dataKey={datoBarras}
                                        position="top"
                                        formatter={datoBarras === "horas" ? (v) => `${v}h` : undefined}
                                        style={{ fontSize: 11 }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    )

                )}

                {tipoVisualizacion === "tabla" && (

                    porEmpleado.length === 0 ? (

                        <p className="text-center text-sm text-gray-400">Sin datos en el rango seleccionado.</p>

                    ) : (

                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-2 text-left text-xs font-semibold leading-tight text-gray-600">Empleado</th>
                                        <th className="p-2 text-left text-xs font-semibold leading-tight text-gray-600">Horario</th>
                                        <th className="p-2 text-left text-xs font-semibold leading-tight text-gray-600">Tardanzas</th>
                                        <th className="p-2 text-left text-xs font-semibold leading-tight text-gray-600">Ausencias</th>
                                        <th className="w-20 p-2 text-left text-xs font-semibold leading-tight text-gray-600">Horas<br />trabajadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {porEmpleado.map((fila) => (
                                        <tr key={fila.id} className="border-t">
                                            <td className="p-2 text-sm font-medium">{fila.nombre}</td>
                                            <td className="p-2 text-sm">{fila.horario}</td>
                                            <td className="p-2 text-sm">{fila.tardanzas}</td>
                                            <td className="p-2 text-sm">{fila.ausencias}</td>
                                            <td className="p-2 text-sm">{fila.horas} h</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )

                )}

                <p className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
                    Colegio Nuevo San Luis Gonzaga — Sistema de Control de Asistencia
                </p>

            </div>

            <Modal
                open={mostrarSelectorImpresion}
                title="Orientación de impresión"
                onClose={() => setMostrarSelectorImpresion(false)}
            >

                <p className="mb-4 text-sm text-gray-600">
                    ¿Cómo quieres imprimir este reporte?
                </p>

                <div className="flex gap-3">

                    <button
                        onClick={() => handleSeleccionarOrientacion("portrait")}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:border-green-700 hover:bg-green-50"
                    >
                        Vertical
                    </button>

                    <button
                        onClick={() => handleSeleccionarOrientacion("landscape")}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:border-green-700 hover:bg-green-50"
                    >
                        Horizontal
                    </button>

                </div>

            </Modal>

        </div>

    );

}
