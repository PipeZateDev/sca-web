"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/PageTitle";

import EmployeeToolbar from "@/components/empleados/EmployeeToolbar";
import EmployeeTable from "@/components/empleados/EmployeeTable";
import EmployeeModal from "@/components/empleados/EmployeeModal";
import EmployeeForm from "@/components/empleados/EmployeeForm";

import { Employee } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";

export default function EmployeesPage() {

    const [open, setOpen] = useState(false);

    const {

    employees,

    loading,

    createEmployee,

    reload

} = useEmployees();

    async function handleSave(employee: Partial<Employee>) {

    const ok = await createEmployee(employee);

    if (!ok) {

        return false;

    }

    setOpen(false);

    await reload();

    return true;

}

    return (

        <MainLayout>

            <PageTitle
                title="Empleados"
                subtitle="Administración de empleados del colegio"
            />

            <EmployeeToolbar
                onNewEmployee={() => setOpen(true)}
            />

            <EmployeeTable

                employees={employees}

                 loading={loading}

            />

            <EmployeeModal
                open={open}
                title="Nuevo empleado"
                onClose={() => setOpen(false)}
            >

                <EmployeeForm
                    onSave={handleSave}
                    onCancel={() => setOpen(false)}
                />

            </EmployeeModal>

        </MainLayout>

    );

}