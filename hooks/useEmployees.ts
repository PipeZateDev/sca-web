"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";

export function useEmployees() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadEmployees() {

        try {

            const response = await fetch("/api/empleados");

            const data = await response.json();

            setEmployees(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadEmployees();

    }, []);

    return {

        employees,

        loading,

        reload: loadEmployees

    };

}