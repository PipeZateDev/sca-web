import { NextRequest, NextResponse } from "next/server";

import { getAttendance } from "@/services/attendance.service";
import { parseFechaISO } from "@/lib/dateParams";

export async function GET(request: NextRequest) {

    try {

        const searchParams = request.nextUrl.searchParams;

        const desde = searchParams.get("desde");
        const hasta = searchParams.get("hasta");
        const biometricoId = searchParams.get("biometricoId");

        const registros = await getAttendance({
            desde: desde ? parseFechaISO(desde) : undefined,
            hasta: hasta ? parseFechaISO(hasta) : undefined,
            biometricoId: biometricoId ?? undefined
        });

        return NextResponse.json(registros);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo asistencias" },
            { status: 500 }
        );

    }

}
