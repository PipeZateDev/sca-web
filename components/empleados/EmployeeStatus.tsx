interface Props {

    estado: string;

}

export default function EmployeeStatus({ estado }: Props) {

    const colors = {

        ACTIVO: "bg-green-100 text-green-700",

        INACTIVO: "bg-red-100 text-red-700",

        VACACIONES: "bg-yellow-100 text-yellow-700",

        LICENCIA: "bg-blue-100 text-blue-700",

    };

    return (

        <span
            className={`

            px-3

            py-1

            rounded-full

            text-xs

            font-semibold

            ${colors[estado as keyof typeof colors]}

        `}
        >

            {estado}

        </span>

    );

}