"use client";

import { useMemo, useState } from "react";

import PageTitle from "@/components/ui/PageTitle";

import EmployeeToolbar from "@/components/empleados/EmployeeToolbar";
import EmployeeTable from "@/components/empleados/EmployeeTable";
import EmployeeDetail from "@/components/empleados/EmployeeDetail";
import Modal from "@/components/ui/Modal";
import EmployeeForm from "@/components/empleados/EmployeeForm";

import { Employee } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";
import { useSchedules } from "@/hooks/useSchedules";

interface Props {
    readOnly?: boolean;
}

export default function EmployeesContent({ readOnly = false }: Props) {

    const [open, setOpen] = useState(false);
    const [viewing, setViewing] = useState<Employee | null>(null);
    const [editing, setEditing] = useState<Employee | null>(null);
    const [query, setQuery] = useState("");

    const {

        employees,

        loading,

        createEmployee,

        updateEmployee,

        deleteEmployee,

        reload

    } = useEmployees();

    const { schedules } = useSchedules();

    const filteredEmployees = useMemo(() => {

        const term = query.trim().toLowerCase();

        if (!term) return employees;

        return employees.filter((employee) => {

            const haystack = [

                employee.codigo,
                employee.tipoDocumento,
                employee.documento,
                employee.nombre,
                employee.apellidos,
                employee.nombreCompleto,
                employee.correo,
                employee.telefono,
                employee.cargo,
                employee.dependencia,
                employee.tipoContrato,
                employee.horario,
                employee.biometrico,
                employee.estado,
                employee.observaciones

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(term);

        });

    }, [employees, query]);

    async function handleSave(employee: Partial<Employee>) {

        const ok = editing?._id
            ? await updateEmployee(editing._id, employee)
            : await createEmployee(employee);

        if (!ok) {

            return false;

        }

        setOpen(false);
        setEditing(null);

        await reload();

        return true;

    }

    function handleView(employee: Employee) {
        setViewing(employee);
    }

    function handleEdit(employee: Employee) {
        setEditing(employee);
        setOpen(true);
    }

    async function handleDelete(employee: Employee) {

        if (!employee._id) return;

        if (!confirm(`¿Eliminar al empleado "${employee.nombreCompleto}"?`)) return;

        await deleteEmployee(employee._id);

    }

    return (

        <>

            <PageTitle
                title="Empleados"
                subtitle="Administración de empleados del colegio"
            />

            <EmployeeToolbar
                query={query}
                onQueryChange={setQuery}
                onNewEmployee={() => {
                    setEditing(null);
                    setOpen(true);
                }}
                readOnly={readOnly}
            />

            <EmployeeTable

                employees={filteredEmployees}

                loading={loading}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDelete}

                readOnly={readOnly}

            />

            <Modal
                open={open}
                title={editing ? "Editar empleado" : "Nuevo empleado"}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
            >

                <EmployeeForm
                    onSave={handleSave}
                    onCancel={() => {
                        setOpen(false);
                        setEditing(null);
                    }}
                    scheduleNames={schedules.map((s) => s.nombre)}
                    initialValue={editing ?? undefined}
                />

            </Modal>

            <Modal
                open={!!viewing}
                title="Detalle del empleado"
                onClose={() => setViewing(null)}
            >

                {viewing && <EmployeeDetail employee={viewing} />}

            </Modal>

        </>

    );

}
