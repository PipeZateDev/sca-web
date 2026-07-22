import { NextRequest, NextResponse } from "next/server";

import {
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "@/services/employee.service";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {

        const { id } = await params;

        const empleado = await getEmployeeById(id);

        if (!empleado) {

            return NextResponse.json(
                { message: "Empleado no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json(empleado);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo empleado" },
            { status: 500 }
        );

    }

}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {

        const { id } = await params;

        const body = await request.json();

        delete body.biometrico;

        const empleado = await updateEmployee(id, body);

        if (!empleado) {

            return NextResponse.json(
                { message: "Empleado no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json(empleado);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error actualizando empleado" },
            { status: 500 }
        );

    }

}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {

        const { id } = await params;

        const eliminado = await deleteEmployee(id);

        if (!eliminado) {

            return NextResponse.json(
                { message: "Empleado no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json({ ok: true });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error eliminando empleado" },
            { status: 500 }
        );

    }

}
