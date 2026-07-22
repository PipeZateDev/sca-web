import { NextRequest, NextResponse } from "next/server";

import { updateSchedule, deleteSchedule } from "@/services/schedule.service";
import { requireEditor } from "@/lib/auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const editor = await requireEditor();

    if (!editor) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const { id } = await params;

        const body = await request.json();

        const horario = await updateSchedule(id, body);

        if (!horario) {

            return NextResponse.json(
                { message: "Horario no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json(horario);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error actualizando horario" },
            { status: 500 }
        );

    }

}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const editor = await requireEditor();

    if (!editor) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const { id } = await params;

        const eliminado = await deleteSchedule(id);

        if (!eliminado) {

            return NextResponse.json(
                { message: "Horario no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json({ ok: true });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error eliminando horario" },
            { status: 500 }
        );

    }

}
