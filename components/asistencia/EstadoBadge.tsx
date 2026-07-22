import { AttendanceEstado } from "@/lib/scheduleEngine";

const ESTILOS: Record<AttendanceEstado, { label: string; className: string }> = {

    A_TIEMPO: { label: "A tiempo", className: "bg-green-100 text-green-800" },
    TARDANZA: { label: "Tardanza", className: "bg-amber-100 text-amber-800" },
    AUSENTE: { label: "Ausente", className: "bg-red-100 text-red-800" },
    PENDIENTE: { label: "Pendiente", className: "bg-slate-100 text-slate-500" },
    SIN_HORARIO: { label: "Sin horario", className: "bg-slate-100 text-slate-500" },
    NO_LABORAL: { label: "No laboral", className: "bg-slate-100 text-slate-400" },
    FESTIVO: { label: "Festivo/Evento", className: "bg-purple-100 text-purple-800" }

};

interface Props {
    estado: AttendanceEstado;
}

export default function EstadoBadge({ estado }: Props) {

    const { label, className } = ESTILOS[estado];

    return (

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
            {label}
        </span>

    );

}
