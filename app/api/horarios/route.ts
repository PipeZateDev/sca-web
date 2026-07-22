import { NextRequest, NextResponse } from "next/server";

import {
    getSchedules,
    createNewSchedule
} from "@/services/schedule.service";
import { requireEditor } from "@/lib/auth";

export async function GET() {

    try {

        const horarios = await getSchedules();

        return NextResponse.json(horarios);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo horarios" },
            { status: 500 }
        );

    }

}

export async function POST(request: NextRequest) {

    const editor = await requireEditor();

    if (!editor) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const body = await request.json();

        const horario = await createNewSchedule(body);

        return NextResponse.json(horario, { status: 201 });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error creando horario" },
            { status: 500 }
        );

    }

}
