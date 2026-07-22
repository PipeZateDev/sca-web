"use client";

export type ReportTab =
    | "asistencia"
    | "tardanzas"
    | "ausencias"
    | "horas"
    | "empleados"
    | "horarios"
    | "festivos";

const TABS: { id: ReportTab; label: string }[] = [
    { id: "asistencia", label: "Asistencia" },
    { id: "tardanzas", label: "Tardanzas" },
    { id: "ausencias", label: "Ausencias" },
    { id: "horas", label: "Horas trabajadas" },
    { id: "empleados", label: "Empleados" },
    { id: "horarios", label: "Horarios asignados" },
    { id: "festivos", label: "Festivos" }
];

interface Props {
    tab: ReportTab;
    onChange: (tab: ReportTab) => void;
}

export default function ReportTabs({ tab, onChange }: Props) {

    return (

        <div className="mb-6 flex flex-wrap gap-2">

            {TABS.map((t) => (

                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        tab === t.id
                            ? "bg-green-700 text-white"
                            : "border bg-white text-gray-600 hover:bg-slate-50"
                    }`}
                >
                    {t.label}
                </button>

            ))}

        </div>

    );

}
