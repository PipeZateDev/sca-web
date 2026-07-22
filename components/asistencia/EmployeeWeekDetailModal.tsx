import Modal from "@/components/ui/Modal";
import EstadoBadge from "./EstadoBadge";
import { EmployeeDayStatus } from "@/types/attendanceStatus";

interface Props {

    open: boolean;

    nombreCompleto: string;

    loading: boolean;

    dias: EmployeeDayStatus[];

    onClose: () => void;

}

function formatFecha(fecha: Date | string): string {

    return new Date(fecha).toLocaleDateString("es-CO", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit"
    });

}

export default function EmployeeWeekDetailModal({

    open,

    nombreCompleto,

    loading,

    dias,

    onClose

}: Props) {

    return (

        <Modal
            open={open}
            title={`Detalle semanal — ${nombreCompleto}`}
            onClose={onClose}
        >

            {loading ? (

                <p className="text-gray-500">Cargando...</p>

            ) : (

                <div className="flex flex-col gap-2">

                    {dias.map((dia) => (

                        <div
                            key={String(dia.fecha)}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >

                            <div>

                                <p className="font-medium capitalize">{formatFecha(dia.fecha)}</p>

                                <p className="text-sm text-gray-500">

                                    {dia.entrada
                                        ? `${dia.entrada} - ${dia.salida ?? "?"}`
                                        : "Sin marcaciones"}

                                </p>

                            </div>

                            <EstadoBadge estado={dia.estado} />

                        </div>

                    ))}

                </div>

            )}

        </Modal>

    );

}
