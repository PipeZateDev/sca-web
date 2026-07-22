"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";
import Modal from "@/components/ui/Modal";

import ScheduleTable from "@/components/horarios/ScheduleTable";
import ScheduleForm from "@/components/horarios/ScheduleForm";

import { Schedule } from "@/types/schedule";
import { useSchedules } from "@/hooks/useSchedules";

export default function HorariosPage() {

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Schedule | null>(null);

    const {

        schedules,

        loading,

        createSchedule,

        updateSchedule,

        deleteSchedule

    } = useSchedules();

    function handleNew() {
        setEditing(null);
        setOpen(true);
    }

    function handleEdit(schedule: Schedule) {
        setEditing(schedule);
        setOpen(true);
    }

    async function handleDelete(schedule: Schedule) {

        if (!schedule._id) return;

        if (!confirm(`¿Eliminar el horario "${schedule.nombre}"?`)) return;

        await deleteSchedule(schedule._id);

    }

    async function handleSave(data: Partial<Schedule>) {

        const ok = editing?._id
            ? await updateSchedule(editing._id, data)
            : await createSchedule(data);

        if (!ok) return false;

        setOpen(false);
        setEditing(null);

        return true;

    }

    return (

        <MainLayout>

            <PageTitle
                title="Horarios"
                subtitle="Turnos y jornadas laborales del colegio"
            />

            <div className="mb-6 flex justify-end">

                <button
                    onClick={handleNew}
                    className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
                >
                    + Nuevo horario
                </button>

            </div>

            <ScheduleTable
                schedules={schedules}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                open={open}
                title={editing ? "Editar horario" : "Nuevo horario"}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
            >

                <ScheduleForm
                    initialValue={editing ?? undefined}
                    onSave={handleSave}
                    onCancel={() => {
                        setOpen(false);
                        setEditing(null);
                    }}
                />

            </Modal>

        </MainLayout>

    );

}
