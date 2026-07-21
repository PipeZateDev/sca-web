import { mockEmployees } from "@/lib/mockEmployees";
import EmployeeRow from "./EmployeeRow";

export default function EmployeeTable() {

    return (

        <div className="bg-white rounded-2xl shadow border overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="text-left p-4">Documento</th>

                        <th className="text-left">Nombre</th>

                        <th className="text-left">Cargo</th>

                        <th className="text-left">Dependencia</th>

                        <th className="text-left">Estado</th>

                        <th className="text-center">Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {mockEmployees.map(employee=>(

                        <EmployeeRow

                            key={employee._id ?? employee.documento}

                            employee={employee}

                        />

                    ))}

                </tbody>

            </table>

        </div>

    );

}