import { Employee } from "@/types/employee";
import EmployeeStatus from "./EmployeeStatus";
import EmployeeActions from "./EmployeeActions";

interface Props {

    employee: Employee;

    onView: (employee: Employee) => void;

    onEdit: (employee: Employee) => void;

    onDelete: (employee: Employee) => void;

    readOnly?: boolean;

}

export default function EmployeeRow({

    employee,

    onView,

    onEdit,

    onDelete,

    readOnly = false

}: Props) {

    return (

        <tr className="border-b">

            <td className="p-4">{employee.documento}</td>

            <td>{employee.nombre}</td>

            <td>{employee.apellidos}</td>

            <td>{employee.cargo}</td>

            <td>

                {employee.horario ? (

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {employee.horario}
                    </span>

                ) : (

                    <span className="text-gray-400">Sin asignar</span>

                )}

            </td>

            <td>

                <EmployeeStatus estado={employee.estado} />

            </td>

            <td>

                <EmployeeActions
                    onView={() => onView(employee)}
                    onEdit={() => onEdit(employee)}
                    onDelete={() => onDelete(employee)}
                    readOnly={readOnly}
                />

            </td>

        </tr>

    );

}
