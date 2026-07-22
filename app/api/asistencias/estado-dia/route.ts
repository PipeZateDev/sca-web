import { NextRequest, NextResponse } from "next/server";

import { getDailyStatus } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";

export async function GET(request: NextRequest) {

    try {

        const fechaParam = request.nextUrl.searchParams.get("fecha");

        const fecha = fechaParam ? parseFechaISO(fechaParam) : new Date();

        const estados = await getDailyStatus(fecha);

        return NextResponse.json(estados);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo el estado del día" },
            { status: 500 }
        );

    }

}
