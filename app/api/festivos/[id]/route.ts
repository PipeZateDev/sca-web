import { NextRequest, NextResponse } from "next/server";

import { deleteHoliday } from "@/services/holiday.service";
import { requireEditor } from "@/lib/auth";

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

        const eliminado = await deleteHoliday(id);

        if (!eliminado) {

            return NextResponse.json(
                { message: "Festivo no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json({ ok: true });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error eliminando festivo" },
            { status: 500 }
        );

    }

}
