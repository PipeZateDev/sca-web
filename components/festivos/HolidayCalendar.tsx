"use client";

import { useMemo, useState } from "react";

import { Holiday } from "@/types/holiday";

interface Props {
    holidays: Holiday[];
    onDayClick: (fechaISO: string) => void;
}

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function toISO(date: Date): string {

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

export default function HolidayCalendar({ holidays, onDayClick }: Props) {

    const [cursor, setCursor] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

    const holidaysByDate = useMemo(() => {

        const mapa = new Map<string, Holiday[]>();

        for (const h of holidays) {

            const iso = toISO(new Date(h.fecha));

            if (!mapa.has(iso)) mapa.set(iso, []);

            mapa.get(iso)!.push(h);

        }

        return mapa;

    }, [holidays]);

    const celdas = useMemo(() => {

        const year = cursor.getFullYear();
        const month = cursor.getMonth();

        const primerDia = new Date(year, month, 1);
        const offset = (primerDia.getDay() + 6) % 7;
        const diasEnMes = new Date(year, month + 1, 0).getDate();

        const resultado: (Date | null)[] = [];

        for (let i = 0; i < offset; i++) resultado.push(null);
        for (let d = 1; d <= diasEnMes; d++) resultado.push(new Date(year, month, d));

        return resultado;

    }, [cursor]);

    return (

        <div className="rounded-2xl border bg-white p-6 shadow">

            <div className="mb-4 flex items-center justify-between">

                <button
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                    className="rounded-lg border px-3 py-1 transition hover:bg-slate-50"
                >
                    ‹
                </button>

                <p className="font-semibold">
                    {MESES[cursor.getMonth()]} {cursor.getFullYear()}
                </p>

                <button
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                    className="rounded-lg border px-3 py-1 transition hover:bg-slate-50"
                >
                    ›
                </button>

            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-500">

                {DIAS_SEMANA.map((d) => <div key={d}>{d}</div>)}

            </div>

            <div className="grid grid-cols-7 gap-1">

                {celdas.map((date, idx) => {

                    if (!date) return <div key={idx} />;

                    const iso = toISO(date);
                    const eventos = holidaysByDate.get(iso) ?? [];
                    const tipo = eventos[0]?.tipo;

                    return (

                        <button
                            key={iso}
                            onClick={() => onDayClick(iso)}
                            title={eventos.map((e) => e.nombre).join(", ")}
                            className={`aspect-square rounded-lg border text-sm transition hover:border-green-600 ${
                                tipo === "FESTIVO"
                                    ? "bg-purple-100 font-medium text-purple-800"
                                    : tipo === "EVENTO"
                                        ? "bg-blue-100 font-medium text-blue-800"
                                        : "bg-white"
                            }`}
                        >

                            {date.getDate()}

                        </button>

                    );

                })}

            </div>

        </div>

    );

}
