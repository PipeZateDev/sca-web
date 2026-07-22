import { Employee } from "@/types/employee";

interface Props {

    employee: Employee;

}

function Field({ label, value }: { label: string; value?: string }) {

    return (

        <div>

            <p className="text-xs uppercase text-gray-400">{label}</p>

            <p className="text-gray-800">{value?.trim() ? value : "-"}</p>

        </div>

    );

}

export default function EmployeeDetail({ employee }: Props) {

    return (

        <div className="grid grid-cols-2 gap-4">

            <Field label="Código" value={employee.codigo} />
            <Field label="Documento" value={`${employee.tipoDocumento} ${employee.documento}`} />
            <Field label="Nombre completo" value={employee.nombreCompleto} />
            <Field label="Correo" value={employee.correo} />
            <Field label="Teléfono" value={employee.telefono} />
            <Field label="Cargo" value={employee.cargo} />
            <Field label="Dependencia" value={employee.dependencia} />
            <Field label="Tipo de contrato" value={employee.tipoContrato} />
            <Field label="Horario" value={employee.horario} />
            <Field label="Código biométrico" value={employee.biometrico} />
            <Field label="Estado" value={employee.estado} />
            <Field
                label="Fecha de ingreso"
                value={new Date(employee.fechaIngreso).toLocaleDateString("es-CO")}
            />

            <div className="col-span-2">

                <Field label="Observaciones" value={employee.observaciones} />

            </div>

        </div>

    );

}
