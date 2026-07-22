"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Schedule } from "@/types/schedule";

export function useSchedules() {

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadSchedules() {

        try {

            setLoading(true);

            const response = await fetch("/api/horarios");

            if (!response.ok) {
                throw new Error("No fue posible cargar los horarios.");
            }

            const data = await response.json();

            setSchedules(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setSchedules([]);

            toast.error("No fue posible cargar los horarios.");

        } finally {

            setLoading(false);

        }

    }

    async function createSchedule(schedule: Partial<Schedule>) {

        try {

            const response = await fetch("/api/horarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(schedule)
            });

            if (!response.ok) throw new Error();

            toast.success("Horario creado correctamente.");
            await loadSchedules();

            return true;

        } catch (error) {

            console.error(error);
            toast.error("No fue posible crear el horario.");

            return false;

        }

    }

    async function updateSchedule(id: string, schedule: Partial<Schedule>) {

        try {

            const response = await fetch(`/api/horarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(schedule)
            });

            if (!response.ok) throw new Error();

            toast.success("Horario actualizado correctamente.");
            await loadSchedules();

            return true;

        } catch (error) {

            console.error(error);
            toast.error("No fue posible actualizar el horario.");

            return false;

        }

    }

    async function deleteSchedule(id: string) {

        try {

            const response = await fetch(`/api/horarios/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error();

            toast.success("Horario eliminado correctamente.");
            await loadSchedules();

            return true;

        } catch (error) {

            console.error(error);
            toast.error("No fue posible eliminar el horario.");

            return false;

        }

    }

    useEffect(() => {

        loadSchedules();

    }, []);

    return {

        schedules,

        loading,

        reload: loadSchedules,

        createSchedule,

        updateSchedule,

        deleteSchedule

    };

}
