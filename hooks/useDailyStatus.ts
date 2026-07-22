"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { EmployeeDayStatus } from "@/types/attendanceStatus";

export function useDailyStatus(fechaISO: string, estudiantes = false) {

    const [estados, setEstados] = useState<EmployeeDayStatus[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const poblacion = estudiantes ? "&poblacion=estudiantes" : "";

            const response = await fetch(`/api/asistencias/estado-dia?fecha=${fechaISO}${poblacion}`);

            if (!response.ok) {
                throw new Error("No fue posible cargar el estado del día.");
            }

            const data = await response.json();

            setEstados(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setEstados([]);

            toast.error("No fue posible cargar el estado del día.");

        } finally {

            setLoading(false);

        }

    }, [fechaISO, estudiantes]);

    useEffect(() => {

        load();

    }, [load]);

    return { estados, loading, reload: load };

}
