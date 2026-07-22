import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyCredentials } from "@/services/user.service";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {

    try {

        const { usuario, password } = await request.json();

        if (!usuario || !password) {

            return NextResponse.json(
                { message: "Debe ingresar usuario y contraseña" },
                { status: 400 }
            );

        }

        const encontrado = await verifyCredentials(usuario, password);

        if (!encontrado) {

            return NextResponse.json(
                { message: "Usuario o contraseña incorrectos" },
                { status: 401 }
            );

        }

        const token = createSessionToken({
            userId: encontrado._id!,
            usuario: encontrado.usuario,
            nombre: encontrado.nombre,
            rol: encontrado.rol
        });

        const store = await cookies();

        store.set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8
        });

        return NextResponse.json({
            nombre: encontrado.nombre,
            rol: encontrado.rol
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Error iniciando sesión" },
            { status: 500 }
        );

    }

}
