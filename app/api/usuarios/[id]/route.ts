import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { updateUser, deleteUser } from "@/services/user.service";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const admin = await requireAdmin();

    if (!admin) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const { id } = await params;

        const body = await request.json();

        const usuario = await updateUser(id, body);

        if (!usuario) {

            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );

        }

        const { passwordHash, ...sinPassword } = usuario;

        return NextResponse.json(sinPassword);

    } catch (error) {

        console.error(error);

        const message =
            error instanceof Error ? error.message : "Error actualizando usuario";

        return NextResponse.json({ message }, { status: 400 });

    }

}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const admin = await requireAdmin();

    if (!admin) {

        return NextResponse.json(
            { message: "No autorizado" },
            { status: 403 }
        );

    }

    try {

        const { id } = await params;

        const eliminado = await deleteUser(id);

        if (!eliminado) {

            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );

        }

        return NextResponse.json({ ok: true });

    } catch (error) {

        console.error(error);

        const message =
            error instanceof Error ? error.message : "Error eliminando usuario";

        return NextResponse.json({ message }, { status: 400 });

    }

}
