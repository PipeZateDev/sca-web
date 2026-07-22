import { NextRequest, NextResponse } from "next/server";

import { importAttendanceWorkbook } from "@/services/attendance.service";

export async function POST(request: NextRequest) {

    try {

        const formData = await request.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {

            return NextResponse.json(
                { message: "Debes adjuntar un archivo." },
                { status: 400 }
            );

        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const resumen = await importAttendanceWorkbook(buffer, file.name);

        return NextResponse.json(resumen, { status: 201 });

    } catch (error) {

        console.error(error);

        const message =
            error instanceof Error
                ? error.message
                : "Error importando el archivo de asistencias";

        return NextResponse.json({ message }, { status: 500 });

    }

}
