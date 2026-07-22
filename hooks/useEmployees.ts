"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Employee } from "@/types/employee";

export function useEmployees() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadEmployees() {

        try {

            setLoading(true);
            setError(null);

            const response = await fetch("/api/empleados");

            if (!response.ok) {
                throw new Error("No fue posible cargar los empleados.");
            }

            const data = await response.json();

            setEmployees(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setEmployees([]);

            setError(
                err instanceof Error
                    ? err.message
                    : "Error cargando empleados."
            );

            toast.error("No fue posible cargar los empleados.");

        } finally {

            setLoading(false);

        }

    }

    async function createEmployee(employee: Partial<Employee>) {

        try {

            const response = await fetch("/api/empleados", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(employee)

            });

            if (!response.ok) {

                throw new Error();

            }

            toast.success("Empleado creado correctamente.");

            await loadEmployees();

            return true;

        } catch (error) {

            console.error(error);

            toast.error("No fue posible crear el empleado.");

            return false;

        }

    }

    async function updateEmployee(id: string, employee: Partial<Employee>) {

        try {

            const response = await fetch(`/api/empleados/${id}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(employee)

            });

            if (!response.ok) {

                throw new Error();

            }

            toast.success("Empleado actualizado correctamente.");

            await loadEmployees();

            return true;

        } catch (error) {

            console.error(error);

            toast.error("No fue posible actualizar el empleado.");

            return false;

        }

    }

    async function deleteEmployee(id: string) {

        try {

            const response = await fetch(`/api/empleados/${id}`, {

                method: "DELETE"

            });

            if (!response.ok) {

                throw new Error();

            }

            toast.success("Empleado eliminado correctamente.");

            await loadEmployees();

            return true;

        } catch (error) {

            console.error(error);

            toast.error("No fue posible eliminar el empleado.");

            return false;

        }

    }

    useEffect(() => {

        loadEmployees();

    }, []);

    return {

        employees,

        loading,

        error,

        reload: loadEmployees,

        createEmployee,

        updateEmployee,

        deleteEmployee

    };

}