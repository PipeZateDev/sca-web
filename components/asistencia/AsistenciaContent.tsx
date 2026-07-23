"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import PeriodoToggle, { Periodo } from "@/components/asistencia/PeriodoToggle";
import DailyStatusView from "@/components/asistencia/DailyStatusView";
import WeeklySummaryView from "@/components/asistencia/WeeklySummaryView";
import { isoFechaBogota } from "@/lib/timezone";
import { AttendanceEstado } from "@/lib/scheduleEngine";

const ESTADO_POR_PARAM: Record<string, AttendanceEstado> = {
    tardanza: "TARDANZA",
    ausente: "AUSENTE"
};

export default function AsistenciaContent() {

    const searchParams = useSearchParams();

    const vistaInicial: Periodo = searchParams.get("vista") === "semana" ? "semana" : "dia";
    const fechaInicial = searchParams.get("fecha") ?? isoFechaBogota();
    const filtroInicial = ESTADO_POR_PARAM[searchParams.get("estado") ?? ""];

    const [periodo, setPeriodo] = useState<Periodo>(vistaInicial);
    const [fecha, setFecha] = useState(fechaInicial);
    const [filtroEstado, setFiltroEstado] = useState<AttendanceEstado | undefined>(filtroInicial);

    return (

        <>

            <PeriodoToggle periodo={periodo} onChange={setPeriodo} />

            {periodo === "dia" ? (

                <DailyStatusView
                    fecha={fecha}
                    onFechaChange={setFecha}
                    filtroEstado={filtroEstado}
                    onFiltroEstadoChange={setFiltroEstado}
                />

            ) : (

                <WeeklySummaryView inicioISO={fecha} onInicioChange={setFecha} />

            )}

        </>

    );

}
