"use client";

import { useState } from "react";
import { Employee } from "@/types/employee";

interface Props {

    onSave: (employee: Partial<Employee>) => Promise<boolean>;

    onCancel: () => void;

    scheduleNames?: string[];

    initialValue?: Employee;

}

const initialState: Partial<Employee> = {

    codigo: "",

    tipoDocumento: "CC",

    documento: "",

    nombre: "",

    apellidos: "",

    correo: "",

    telefono: "",

    cargo: "",

    dependencia: "",

    tipoContrato: "",

    horario: "",

    biometrico: "",

    estado: "ACTIVO",

    observaciones: ""

};

export default function EmployeeForm({

    onSave,

    onCancel,

    scheduleNames = [],

    initialValue

}: Props) {

    const [form, setForm] = useState(initialValue ?? initialState);

    const [saving, setSaving] = useState(false);

    function handleChange(

        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

    ) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(

        e: React.FormEvent

    ) {

        e.preventDefault();

        if (!form.documento?.trim()) {

            alert("Debe ingresar el documento.");

            return;

        }

        if (!form.nombre?.trim()) {

            alert("Debe ingresar el nombre.");

            return;

        }

        if (!form.apellidos?.trim()) {

            alert("Debe ingresar los apellidos.");

            return;

        }

        setSaving(true);

        const ok = await onSave(form);

        setSaving(false);

        if (ok && !initialValue) {

            setForm(initialState);

        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
        >

            <input
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Código"
                className="border rounded-lg p-2"
            />

            <select
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                className="border rounded-lg p-2"
            >

                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="TI">TI</option>
                <option value="PP">Pasaporte</option>

            </select>

            <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                placeholder="Documento"
                className="border rounded-lg p-2"
            />

            <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="border rounded-lg p-2"
            />

            <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                className="border rounded-lg p-2"
            />

            <input
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="Correo"
                className="border rounded-lg p-2 col-span-2"
            />

            <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="border rounded-lg p-2"
            />

            <input
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                placeholder="Cargo"
                className="border rounded-lg p-2"
            />

            <input
                name="dependencia"
                value={form.dependencia}
                onChange={handleChange}
                placeholder="Dependencia"
                className="border rounded-lg p-2"
            />

            <input
                name="tipoContrato"
                value={form.tipoContrato}
                onChange={handleChange}
                placeholder="Tipo de contrato"
                className="border rounded-lg p-2"
            />

            <select
                name="horario"
                value={form.horario}
                onChange={handleChange}
                className="border rounded-lg p-2"
            >

                <option value="">Sin horario asignado</option>

                {scheduleNames.map((nombre) => (
                    <option key={nombre} value={nombre}>
                        {nombre}
                    </option>
                ))}

            </select>

            <div className="flex flex-col justify-center rounded-lg border bg-gray-50 p-2">

                <span className="text-xs text-gray-500">
                    Código biométrico (asignado por el dispositivo)
                </span>

                <span className="text-gray-700">
                    {form.biometrico || "Sin asignar — se completa al importar asistencias"}
                </span>

            </div>

            <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="border rounded-lg p-2"
            >

                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>

            </select>

            <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                placeholder="Observaciones"
                className="border rounded-lg p-2 col-span-2"
            />

            <div className="col-span-2 flex justify-end gap-3 mt-4">

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border"
                >

                    Cancelar

                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
                >

                    {saving ? "Guardando..." : "Guardar"}

                </button>

            </div>

        </form>

    );

}