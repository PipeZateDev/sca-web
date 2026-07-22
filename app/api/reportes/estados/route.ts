import { NextRequest, NextResponse } from "next/server";

import { getRangeStatuses } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";
import { Poblacion } from "@/lib/students";

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

        const poblacion: Poblacion =
            request.nextUrl.searchParams.get("poblacion") === "estudiantes"
                ? "ESTUDIANTES"
                : "EMPLEADOS";

        const estados = await getRangeStatuses(
            parseFechaISO(desdeParam),
            parseFechaISO(hastaParam),
            poblacion
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
