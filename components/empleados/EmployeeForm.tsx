"use client";

export default function EmployeeForm() {

    return (

        <form className="grid grid-cols-2 gap-4">

            <input
                placeholder="Código"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Documento"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Nombre"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Apellidos"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Correo"
                className="border rounded-lg p-2 col-span-2"
            />

            <input
                placeholder="Teléfono"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Cargo"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Dependencia"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Horario"
                className="border rounded-lg p-2"
            />

            <input
                placeholder="Biométrico"
                className="border rounded-lg p-2"
            />

            <textarea
                placeholder="Observaciones"
                className="border rounded-lg p-2 col-span-2"
            />

            <div className="col-span-2 flex justify-end gap-3 mt-4">

                <button
                    type="button"
                    className="px-4 py-2 rounded-lg border"
                >

                    Cancelar

                </button>

                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                >

                    Guardar

                </button>

            </div>

        </form>

    );

}