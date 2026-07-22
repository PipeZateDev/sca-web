import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getUsers, createNewUser } from "@/services/user.service";

export async function GET() {

    const admin = await requireAdmin();

    if (!admin) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const usuarios = await getUsers();

        const sinPassword = usuarios.map(({ passwordHash, ...resto }) => resto);

        return NextResponse.json(sinPassword);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error obteniendo usuarios" },
            { status: 500 }
        );

    }

}

export async function POST(request: NextRequest) {

    const admin = await requireAdmin();

    if (!admin) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const body = await request.json();

        const usuario = await createNewUser(body);

        const { passwordHash, ...sinPassword } = usuario;

        return NextResponse.json(sinPassword, { status: 201 });

    } catch (error) {

        console.error(error);

        const message =
            error instanceof Error ? error.message : "Error creando usuario";

        return NextResponse.json({ message }, { status: 400 });

    }

}
