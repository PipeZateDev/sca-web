import { Eye, Pencil, Trash2 } from "lucide-react";

export default function EmployeeActions() {

    return (

        <div className="flex gap-3">

            <button>

                <Eye
                    size={18}
                    className="text-blue-600"
                />

            </button>

            <button>

                <Pencil
                    size={18}
                    className="text-green-600"
                />

            </button>

            <button>

                <Trash2
                    size={18}
                    className="text-red-600"
                />

            </button>

        </div>

    );

}