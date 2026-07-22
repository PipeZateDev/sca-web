"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import type { ImportAttendanceSummary } from "@/services/attendance.service";

export function useAttendanceImport() {

    const [loading, setLoading] = useState(false);
    const [resumen, setResumen] = useState<ImportAttendanceSummary | null>(null);

    async function importFile(file: File) {

        try {

            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/asistencias/importar", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message ?? "Error importando el archivo.");
            }

            setResumen(data);

            toast.success(
                `Importación completada: ${data.registrosImportados} registros.`
            );

            return data as ImportAttendanceSummary;

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "No fue posible importar el archivo."
            );

            return null;

        } finally {

            setLoading(false);

        }

    }

    return {

        importFile,

        loading,

        resumen

    };

}
