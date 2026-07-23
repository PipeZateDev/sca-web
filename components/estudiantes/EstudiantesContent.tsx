"use client";

import { useState } from "react";

import PageTitle from "@/components/ui/PageTitle";
import PeriodoToggle, { Periodo } from "@/components/asistencia/PeriodoToggle";
import DailyStatusView from "@/components/asistencia/DailyStatusView";
import WeeklySummaryView from "@/components/asistencia/WeeklySummaryView";
import { isoFechaBogota } from "@/lib/timezone";

export default function EstudiantesContent() {

    const [periodo, setPeriodo] = useState<Periodo>("dia");
    const [fecha, setFecha] = useState(isoFechaBogota());

    return (

        <>

            <PageTitle
                title="Estudiantes"
                subtitle="Validación de la hora de llegada registrada en el biométrico"
            />

            <PeriodoToggle periodo={periodo} onChange={setPeriodo} />

            {periodo === "dia" ? (

                <DailyStatusView fecha={fecha} onFechaChange={setFecha} estudiantes />

            ) : (

                <WeeklySummaryView inicioISO={fecha} onInicioChange={setFecha} estudiantes />

            )}

        </>

    );

}
