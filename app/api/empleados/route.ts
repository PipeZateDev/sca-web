import { NextRequest, NextResponse } from "next/server";

import {
    getEmployees,
    createNewEmployee
} from "@/services/employee.service";

export async function GET() {

    try {

        const empleados = await getEmployees();

        return NextResponse.json(empleados);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo empleados" },
            { status: 500 }
        );

    }

}

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        delete body.biometrico;

        const empleado = await createNewEmployee(body);

        return NextResponse.json(empleado, { status: 201 });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error creando empleado" },
            { status: 500 }
        );

    }

}