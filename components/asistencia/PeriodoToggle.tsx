"use client";

export type Periodo = "dia" | "semana";

interface Props {
    periodo: Periodo;
    onChange: (periodo: Periodo) => void;
}

export default function PeriodoToggle({ periodo, onChange }: Props) {

    return (

        <div className="mb-6 inline-flex rounded-lg border bg-white p-1 shadow-sm">

            <button
                onClick={() => onChange("dia")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    periodo === "dia"
                        ? "bg-green-700 text-white"
                        : "text-gray-600 hover:bg-slate-100"
                }`}
            >
                Día
            </button>

            <button
                onClick={() => onChange("semana")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    periodo === "semana"
                        ? "bg-green-700 text-white"
                        : "text-gray-600 hover:bg-slate-100"
                }`}
            >
                Semana
            </button>

        </div>

    );

}
