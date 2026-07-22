import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";

export async function GET() {

    const session = await getSessionUser();

    if (!session) {

        return NextResponse.json(
            { message: "No hay sesión activa" },
            { status: 401 }
        );

    }

    return NextResponse.json(session);

}
