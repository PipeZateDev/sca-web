"use client";

interface EmployeeToolbarProps {
    query: string;
    onQueryChange: (value: string) => void;
    onNewEmployee: () => void;
}

export default function EmployeeToolbar({
    query,
    onQueryChange,
    onNewEmployee,
}: EmployeeToolbarProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-center md:justify-between">

            <div className="flex-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Buscar empleado por documento, nombre, cargo, horario, estado..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
                />
            </div>

            <button
                onClick={onNewEmployee}
                className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
            >
                + Nuevo empleado
            </button>

        </div>
    );
}
