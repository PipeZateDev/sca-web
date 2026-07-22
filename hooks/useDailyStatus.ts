"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { EmployeeDayStatus } from "@/types/attendanceStatus";

export function useDailyStatus(fechaISO: string) {

    const [estados, setEstados] = useState<EmployeeDayStatus[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {

        try {

            setLoading(true);

            const response = await fetch(`/api/asistencias/estado-dia?fecha=${fechaISO}`);

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

    }, [fechaISO]);

    useEffect(() => {

        load();

    }, [load]);

    return { estados, loading, reload: load };

}
