import { Employee } from "@/types/employee";
import EmployeeStatus from "./EmployeeStatus";
import EmployeeActions from "./EmployeeActions";

interface Props {

    employee: Employee;

}

export default function EmployeeRow({

    employee,

}: Props) {

    return (

        <tr className="border-b">

            <td className="p-4">{employee.documento}</td>

            <td>{employee.nombre}</td>

            <td>{employee.cargo}</td>

            <td>{employee.dependencia}</td>

            <td>

                <EmployeeStatus estado={employee.estado} />

            </td>

            <td>

                <EmployeeActions />

            </td>

        </tr>

    );

}