import { NextRequest, NextResponse } from "next/server";

import { getSessionUser, verifyPassword } from "@/lib/auth";
import { getUserById, updateUser } from "@/services/user.service";

export async function PUT(request: NextRequest) {

    try {

        const session = await getSessionUser();

        if (!session) {

            return NextResponse.json(
                { message: "No hay sesión activa" },
                { status: 401 }
            );

        }

        const { actual, nueva } = await request.json();

        if (!actual || !nueva) {

            return NextResponse.json(
                { message: "Debe ingresar la contraseña actual y la nueva" },
                { status: 400 }
            );

        }

        const usuario = await getUserById(session.userId);

        if (!usuario) {

            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );

        }

        const valido = await verifyPassword(actual, usuario.passwordHash);

        if (!valido) {

            return NextResponse.json(
                { message: "La contraseña actual no es correcta" },
                { status: 400 }
            );

        }

        await updateUser(session.userId, { password: nueva });

        return NextResponse.json({ ok: true });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error cambiando la contraseña" },
            { status: 500 }
        );

    }

}
