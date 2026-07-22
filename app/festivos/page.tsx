"use client";

import { useMemo, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import Modal from "@/components/ui/Modal";

import HolidayCalendar from "@/components/festivos/HolidayCalendar";
import HolidayForm, { HolidayFormData } from "@/components/festivos/HolidayForm";
import HolidayList from "@/components/festivos/HolidayList";

import { Holiday } from "@/types/holiday";
import { useHolidays } from "@/hooks/useHolidays";
import { useEmployees } from "@/hooks/useEmployees";

export default function FestivosPage() {

    const [open, setOpen] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string | undefined>(undefined);

    const {

        holidays,

        loading,

        createHoliday,

        deleteHoliday

    } = useHolidays();

    const { employees } = useEmployees();

    const dependenciasDisponibles = useMemo(() => {

        const unicas = new Set(
            employees.map((e) => e.dependencia).filter(Boolean)
        );

        return Array.from(unicas).sort();

    }, [employees]);

    function handleDayClick(fechaISO: string) {

        setFechaSeleccionada(fechaISO);
        setOpen(true);

    }

    async function handleSave(data: HolidayFormData) {

        const ok = await createHoliday(data as unknown as Partial<Holiday>);

        if (!ok) return false;

        setOpen(false);

        return true;

    }

    async function handleDelete(holiday: Holiday) {

        if (!holiday._id) return;

        if (!confirm(`¿Eliminar "${holiday.nombre}"?`)) return;

        await deleteHoliday(holiday._id);

    }

    return (

        <MainLayout>

            <PageTitle
                title="Festivos"
                subtitle="Días no laborales: festivos oficiales y eventos del colegio"
            />

            <div className="mb-6 flex justify-end">

                <button
                    onClick={() => {
                        setFechaSeleccionada(undefined);
                        setOpen(true);
                    }}
                    className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
                >
                    + Nuevo festivo
                </button>

            </div>

            <div className="mb-8">

                <HolidayCalendar holidays={holidays} onDayClick={handleDayClick} />

            </div>

            <HolidayList holidays={holidays} loading={loading} onDelete={handleDelete} />

            <Modal
                open={open}
                title="Nuevo festivo / evento"
                onClose={() => setOpen(false)}
            >

                <HolidayForm
                    fechaInicial={fechaSeleccionada}
                    dependenciasDisponibles={dependenciasDisponibles}
                    onSave={handleSave}
                    onCancel={() => setOpen(false)}
                />

            </Modal>

        </MainLayout>

    );

}
