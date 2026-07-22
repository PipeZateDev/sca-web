"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import PageTitle from "@/components/ui/PageTitle";
import Modal from "@/components/ui/Modal";

import HolidayCalendar from "@/components/festivos/HolidayCalendar";
import HolidayForm, { HolidayFormData } from "@/components/festivos/HolidayForm";
import HolidayList from "@/components/festivos/HolidayList";

import { Holiday } from "@/types/holiday";
import { useHolidays } from "@/hooks/useHolidays";
import { useSchedules } from "@/hooks/useSchedules";

function toISO(date: Date): string {

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

export default function HolidaysContent() {

    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);

    const {

        holidays,

        loading,

        createHoliday,

        deleteHoliday

    } = useHolidays();

    const { schedules } = useSchedules();

    const horariosDisponibles = useMemo(
        () => schedules.map((s) => s.nombre).sort(),
        [schedules]
    );

    const holidaysDelDiaSeleccionado = useMemo(() => {

        if (!selectedDate) return [];

        return holidays.filter((h) => toISO(new Date(h.fecha)) === selectedDate);

    }, [holidays, selectedDate]);

    function handleDayClick(fechaISO: string) {

        const existentes = holidays.filter(
            (h) => toISO(new Date(h.fecha)) === fechaISO
        );

        setSelectedDate(fechaISO);
        setShowForm(existentes.length === 0);
        setOpen(true);

    }

    function handleNew() {

        setSelectedDate(undefined);
        setShowForm(true);
        setOpen(true);

    }

    async function handleSave(data: HolidayFormData) {

        const ok = await createHoliday(data as unknown as Partial<Holiday>);

        if (!ok) return false;

        if (selectedDate) {
            setShowForm(false);
        } else {
            setOpen(false);
        }

        return true;

    }

    async function handleDelete(holiday: Holiday) {

        if (!holiday._id) return;

        if (!confirm(`¿Eliminar "${holiday.nombre}"?`)) return;

        await deleteHoliday(holiday._id);

    }

    const modalTitle = selectedDate
        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        : "Nuevo festivo / evento";

    return (

        <>

            <PageTitle
                title="Festivos"
                subtitle="Días no laborales: festivos oficiales y eventos del colegio"
            />

            <div className="mb-6 flex justify-end">

                <button
                    onClick={handleNew}
                    className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
                >
                    + Nuevo festivo
                </button>

            </div>

            <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[20rem_1fr]">

                <HolidayCalendar holidays={holidays} onDayClick={handleDayClick} />

                <HolidayList holidays={holidays} loading={loading} onDelete={handleDelete} />

            </div>

            <Modal
                open={open}
                title={modalTitle}
                onClose={() => setOpen(false)}
            >

                {holidaysDelDiaSeleccionado.length > 0 && !showForm && (

                    <div className="flex flex-col gap-3">

                        {holidaysDelDiaSeleccionado.map((h) => (

                            <div
                                key={h._id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >

                                <div>

                                    <p className="font-medium">{h.nombre}</p>

                                    <p className="text-sm text-gray-500">

                                        {h.tipo === "FESTIVO" ? "Festivo" : "Evento"} ·{" "}
                                        {h.horarios.length === 0
                                            ? "Todos los horarios"
                                            : h.horarios.join(", ")}

                                    </p>

                                </div>

                                <button
                                    onClick={() => handleDelete(h)}
                                    className="rounded-full p-2 text-red-600 transition-all duration-150 hover:scale-110 hover:bg-red-100"
                                >
                                    <Trash2 size={18} />
                                </button>

                            </div>

                        ))}

                        <button
                            onClick={() => setShowForm(true)}
                            className="text-left text-sm text-green-700 hover:underline"
                        >
                            + Agregar otro festivo/evento este día
                        </button>

                    </div>

                )}

                {(showForm || holidaysDelDiaSeleccionado.length === 0) && (

                    <HolidayForm
                        fechaInicial={selectedDate}
                        horariosDisponibles={horariosDisponibles}
                        onSave={handleSave}
                        onCancel={() => {

                            if (holidaysDelDiaSeleccionado.length > 0) {
                                setShowForm(false);
                            } else {
                                setOpen(false);
                            }

                        }}
                    />

                )}

            </Modal>

        </>

    );

}
