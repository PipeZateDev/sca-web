import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {

    onView: () => void;

    onEdit: () => void;

    onDelete: () => void;

}

export default function EmployeeActions({

    onView,

    onEdit,

    onDelete

}: Props) {

    return (

        <div className="flex gap-2">

            <button
                onClick={onView}
                title="Ver"
                className="rounded-full p-2 text-blue-600 transition-all duration-150 hover:scale-110 hover:bg-blue-100"
            >

                <Eye size={18} />

            </button>

            <button
                onClick={onEdit}
                title="Editar"
                className="rounded-full p-2 text-green-600 transition-all duration-150 hover:scale-110 hover:bg-green-100"
            >

                <Pencil size={18} />

            </button>

            <button
                onClick={onDelete}
                title="Eliminar"
                className="rounded-full p-2 text-red-600 transition-all duration-150 hover:scale-110 hover:bg-red-100"
            >

                <Trash2 size={18} />

            </button>

        </div>

    );

}
