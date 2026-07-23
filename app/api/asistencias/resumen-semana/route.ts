import { NextRequest, NextResponse } from "next/server";

import { getWeeklySummary } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";
import { Poblacion } from "@/lib/students";
import { fechaBogota } from "@/lib/timezone";

export async function GET(request: NextRequest) {

    try {

        const inicioParam = request.nextUrl.searchParams.get("inicio");

        const inicio = inicioParam ? parseFechaISO(inicioParam) : fechaBogota();

        const poblacion: Poblacion =
            request.nextUrl.searchParams.get("poblacion") === "estudiantes"
                ? "ESTUDIANTES"
                : "EMPLEADOS";

        const resumen = await getWeeklySummary(inicio, poblacion);

        return NextResponse.json(resumen);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo el resumen semanal" },
            { status: 500 }
        );

    }

}
