import { NextRequest, NextResponse } from "next/server";

import {
    getHolidays,
    createNewHoliday
} from "@/services/holiday.service";
import { parseFechaISO } from "@/lib/dateParams";

export async function GET() {

    try {

        const festivos = await getHolidays();

        return NextResponse.json(festivos);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo festivos" },
            { status: 500 }
        );

    }

}

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        if (typeof body.fecha === "string") {
            body.fecha = parseFechaISO(body.fecha);
        }

        const festivo = await createNewHoliday(body);

        return NextResponse.json(festivo, { status: 201 });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error creando festivo" },
            { status: 500 }
        );

    }

}
