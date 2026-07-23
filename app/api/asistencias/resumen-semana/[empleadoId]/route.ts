import { NextRequest, NextResponse } from "next/server";

import { getEmployeeWeekDetail } from "@/services/attendanceStatus.service";
import { parseFechaISO } from "@/lib/dateParams";
import { Poblacion } from "@/lib/students";
import { fechaBogota } from "@/lib/timezone";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ empleadoId: string }> }
) {

    try {

        const { empleadoId } = await params;

        const inicioParam = request.nextUrl.searchParams.get("inicio");

        const inicio = inicioParam ? parseFechaISO(inicioParam) : fechaBogota();

        const poblacion: Poblacion =
            request.nextUrl.searchParams.get("poblacion") === "estudiantes"
                ? "ESTUDIANTES"
                : "EMPLEADOS";

        const detalle = await getEmployeeWeekDetail(empleadoId, inicio, poblacion);

        return NextResponse.json(detalle);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo el detalle semanal del empleado" },
            { status: 500 }
        );

    }

}
