"use client";

import { Employee } from "@/types/employee";
import EmployeeRow from "./EmployeeRow";

interface EmployeeTableProps {

    employees: Employee[];

    loading: boolean;

    onView: (employee: Employee) => void;

    onEdit: (employee: Employee) => void;

    onDelete: (employee: Employee) => void;

}

export default function EmployeeTable({

    employees,

    loading,

    onView,

    onEdit,

    onDelete

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

                            Apellidos

                        </th>

                        <th className="text-left">

                            Cargo

                        </th>

                        <th className="text-left">

                            Horario

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
                                colSpan={7}
                                className="p-8 text-center text-gray-500"
                            >

                                No se encontraron empleados.

                            </td>

                        </tr>

                    ) : (

                        employees.map((employee) => (

                            <EmployeeRow
                                key={employee._id ?? employee.documento}
                                employee={employee}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}