"use client";

import { useRef, useState } from "react";

import type { ImportAttendanceSummary } from "@/services/attendance.service";

interface ImportUploaderProps {

    loading: boolean;

    onImport: (file: File) => Promise<ImportAttendanceSummary | null>;

}

export default function ImportUploader({ loading, onImport }: ImportUploaderProps) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resumen, setResumen] = useState<ImportAttendanceSummary | null>(null);

    async function handleSubmit() {

        if (!selectedFile) return;

        const resultado = await onImport(selectedFile);

        if (resultado) {
            setResumen(resultado);
        }

    }

    return (

        <div className="rounded-2xl border bg-white p-6 shadow">

            <p className="mb-4 text-gray-600">

                Selecciona el reporte de asistencias exportado por el software del biométrico (.xls o .xlsx).

            </p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">

                <input
                    ref={inputRef}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2"
                />

                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || loading}
                    className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    {loading ? "Importando..." : "Importar"}
                </button>

            </div>

            {resumen && (

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">

                    <p>

                        Periodo: {new Date(resumen.periodoInicio).toLocaleDateString("es-CO")}
                        {" – "}
                        {new Date(resumen.periodoFin).toLocaleDateString("es-CO")}

                    </p>

                    <p>Registros nuevos o completados: {resumen.registrosImportados}</p>

                    <p>Registros ya completos (sin tocar): {resumen.registrosOmitidos}</p>

                    <p>Empleados ya vinculados: {resumen.empleadosVinculados}</p>

                    {resumen.empleadosCreados.length > 0 && (

                        <div className="mt-2">

                            <p className="font-medium">

                                Empleados creados automáticamente (revisar y completar sus datos en Empleados):

                            </p>

                            <ul className="ml-4 list-disc">

                                {resumen.empleadosCreados.map((emp) => (

                                    <li key={emp.biometricoId}>

                                        ID {emp.biometricoId} — {emp.nombre}

                                    </li>

                                ))}

                            </ul>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}
