"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";

export function useWeeklySummary(inicioISO: string, estudiantes = false) {

    const [resumen, setResumen] = useState<EmployeeWeekSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const poblacion = estudiantes ? "&poblacion=estudiantes" : "";

            const response = await fetch(`/api/asistencias/resumen-semana?inicio=${inicioISO}${poblacion}`);

            if (!response.ok) {
                throw new Error("No fue posible cargar el resumen semanal.");
            }

            const data = await response.json();

            setResumen(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setResumen([]);

            toast.error("No fue posible cargar el resumen semanal.");

        } finally {

            setLoading(false);

        }

    }, [inicioISO, estudiantes]);

    useEffect(() => {

        load();

    }, [load]);

    return { resumen, loading, reload: load };

}

export async function fetchEmployeeWeekDetail(
    empleadoId: string,
    inicioISO: string,
    estudiantes = false
): Promise<EmployeeDayStatus[]> {

    const poblacion = estudiantes ? "&poblacion=estudiantes" : "";

    const response = await fetch(
        `/api/asistencias/resumen-semana/${empleadoId}?inicio=${inicioISO}${poblacion}`
    );

    if (!response.ok) {
        throw new Error("No fue posible cargar el detalle del empleado.");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];

}
