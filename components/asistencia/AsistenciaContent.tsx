"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import PeriodoToggle, { Periodo } from "@/components/asistencia/PeriodoToggle";
import DailyStatusView from "@/components/asistencia/DailyStatusView";
import WeeklySummaryView from "@/components/asistencia/WeeklySummaryView";

function isoToday(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function AsistenciaContent() {

    const searchParams = useSearchParams();

    const vistaInicial: Periodo = searchParams.get("vista") === "semana" ? "semana" : "dia";
    const fechaInicial = searchParams.get("fecha") ?? isoToday();

    const [periodo, setPeriodo] = useState<Periodo>(vistaInicial);
    const [fecha, setFecha] = useState(fechaInicial);

    return (

        <>

            <PeriodoToggle periodo={periodo} onChange={setPeriodo} />

            {periodo === "dia" ? (

                <DailyStatusView fecha={fecha} onFechaChange={setFecha} />

            ) : (

                <WeeklySummaryView inicioISO={fecha} onInicioChange={setFecha} />

            )}

        </>

    );

}
