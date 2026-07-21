"use client";

import { Employee } from "@/types/employee";
import EmployeeRow from "./EmployeeRow";

interface EmployeeTableProps {

    employees: Employee[];

    loading: boolean;

}

export default function EmployeeTable({

    employees,

    loading

}: EmployeeTableProps) {

    if (loading) {

        return (

            <div className="rounded-2xl border bg-white p-10 text-center shadow">

                Cargando empleados...

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-2xl border bg-white shadow">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="p-4 text-left">

                            Documento

                        </th>

                        <th className="text-left">

                            Nombre

                        </th>

                        <th className="text-left">

                            Cargo

                        </th>

                        <th className="text-left">

                            Dependencia

                        </th>

                        <th className="text-left">

                            Estado

                        </th>

                        <th className="text-center">

                            Acciones

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {employees.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                className="p-8 text-center text-gray-500"
                            >

                                No existen empleados registrados.

                            </td>

                        </tr>

                    ) : (

                        employees.map((employee) => (

                            <EmployeeRow
                                key={employee._id ?? employee.documento}
                                employee={employee}
                            />

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}