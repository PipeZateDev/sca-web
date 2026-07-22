"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Holiday } from "@/types/holiday";

export function useHolidays() {

    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadHolidays() {

        try {

            setLoading(true);

            const response = await fetch("/api/festivos");

            if (!response.ok) {
                throw new Error("No fue posible cargar los festivos.");
            }

            const data = await response.json();

            setHolidays(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setHolidays([]);

            toast.error("No fue posible cargar los festivos.");

        } finally {

            setLoading(false);

        }

    }

    async function createHoliday(holiday: Partial<Holiday>) {

        try {

            const response = await fetch("/api/festivos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(holiday)
            });

            if (!response.ok) throw new Error();

            toast.success("Festivo creado correctamente.");
            await loadHolidays();

            return true;

        } catch (error) {

            console.error(error);
            toast.error("No fue posible crear el festivo.");

            return false;

        }

    }

    async function deleteHoliday(id: string) {

        try {

            const response = await fetch(`/api/festivos/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error();

            toast.success("Festivo eliminado correctamente.");
            await loadHolidays();

            return true;

        } catch (error) {

            console.error(error);
            toast.error("No fue posible eliminar el festivo.");

            return false;

        }

    }

    useEffect(() => {

        loadHolidays();

    }, []);

    return {

        holidays,

        loading,

        reload: loadHolidays,

        createHoliday,

        deleteHoliday

    };

}
