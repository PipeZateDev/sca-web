"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { EmployeeDayStatus, EmployeeWeekSummary } from "@/types/attendanceStatus";

export function useWeeklySummary(inicioISO: string) {

    const [resumen, setResumen] = useState<EmployeeWeekSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const response = await fetch(`/api/asistencias/resumen-semana?inicio=${inicioISO}`);

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

    }, [inicioISO]);

    useEffect(() => {

        load();

    }, [load]);

    return { resumen, loading, reload: load };

}

export async function fetchEmployeeWeekDetail(
    empleadoId: string,
    inicioISO: string
): Promise<EmployeeDayStatus[]> {

    const response = await fetch(
        `/api/asistencias/resumen-semana/${empleadoId}?inicio=${inicioISO}`
    );

    if (!response.ok) {
        throw new Error("No fue posible cargar el detalle del empleado.");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];

}
