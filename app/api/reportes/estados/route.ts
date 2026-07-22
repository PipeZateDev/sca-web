import { NextRequest, NextResponse } from "next/server";

import { getRangeStatuses } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";

export async function GET(request: NextRequest) {

    try {

        const desdeParam = request.nextUrl.searchParams.get("desde");
        const hastaParam = request.nextUrl.searchParams.get("hasta");

        if (!desdeParam || !hastaParam) {

            return NextResponse.json(
                { message: "Debe indicar 'desde' y 'hasta'" },
                { status: 400 }
            );

        }

        const estados = await getRangeStatuses(
            parseFechaISO(desdeParam),
            parseFechaISO(hastaParam)
        );

        return NextResponse.json(estados);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo el reporte de estados" },
            { status: 500 }
        );

    }

}
