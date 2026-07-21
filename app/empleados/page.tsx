"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import PageTitle from "@/components/ui/PageTitle";

import EmployeeToolbar from "@/components/empleados/EmployeeToolbar";
import EmployeeTable from "@/components/empleados/EmployeeTable";
import EmployeeModal from "@/components/empleados/EmployeeModal";
import EmployeeForm from "@/components/empleados/EmployeeForm";

export default function EmployeesPage() {

    const [open, setOpen] = useState(false);

    return (

        <MainLayout>

            <PageTitle
                title="Empleados"
                subtitle="Administración de empleados del colegio"
            />

            <EmployeeToolbar
                onNewEmployee={() => setOpen(true)}
            />

            <EmployeeTable />

            <EmployeeModal
                open={open}
                title="Nuevo empleado"
                onClose={() => setOpen(false)}
            >
                <EmployeeForm />
            </EmployeeModal>

        </MainLayout>

    );

}