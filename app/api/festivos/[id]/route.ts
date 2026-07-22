import { NextRequest, NextResponse } from "next/server";

import { deleteHoliday } from "@/services/holiday.service";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

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
