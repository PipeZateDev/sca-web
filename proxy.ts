import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { Role } from "@/types/user";

const PUBLIC_PREFIXES = ["/login", "/api/auth/login"];

const SECCIONES_RESTRINGIDAS: { prefijo: string; roles: Role[] }[] = [
    { prefijo: "/configuracion", roles: ["ADMINISTRADOR"] },
    { prefijo: "/asistencia", roles: ["ADMINISTRADOR", "COORDINADOR"] },
    { prefijo: "/estudiantes", roles: ["ADMINISTRADOR", "COORDINADOR"] },
    { prefijo: "/importacion", roles: ["ADMINISTRADOR", "COORDINADOR"] },
    { prefijo: "/horarios", roles: ["ADMINISTRADOR", "COORDINADOR"] },
    { prefijo: "/festivos", roles: ["ADMINISTRADOR", "COORDINADOR"] }
];

function esRutaPublica(pathname: string): boolean {

    return PUBLIC_PREFIXES.some(
        (prefijo) => pathname === prefijo || pathname.startsWith(`${prefijo}/`)
    );

}

function seccionRestringida(pathname: string) {

    return SECCIONES_RESTRINGIDAS.find(
        (seccion) =>
            pathname === seccion.prefijo || pathname.startsWith(`${seccion.prefijo}/`)
    );

}

export default function proxy(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? verifySessionToken(token) : null;

    if (pathname === "/login") {

        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();

    }

    if (esRutaPublica(pathname)) {
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const seccion = seccionRestringida(pathname);

    if (seccion && !seccion.roles.includes(session.rol)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|logo|public).*)"
    ]
};
