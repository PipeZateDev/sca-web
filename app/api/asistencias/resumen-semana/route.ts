import { NextRequest, NextResponse } from "next/server";

import { getWeeklySummary } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";

export async function GET(request: NextRequest) {

    try {

        const inicioParam = request.nextUrl.searchParams.get("inicio");

        const inicio = inicioParam ? parseFechaISO(inicioParam) : new Date();

        const resumen = await getWeeklySummary(inicio);

        return NextResponse.json(resumen);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo el resumen semanal" },
            { status: 500 }
        );

    }

}
