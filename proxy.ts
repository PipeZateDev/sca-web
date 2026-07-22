import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const PUBLIC_PREFIXES = ["/login", "/api/auth/login"];

function esRutaPublica(pathname: string): boolean {

    return PUBLIC_PREFIXES.some(
        (prefijo) => pathname === prefijo || pathname.startsWith(`${prefijo}/`)
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

    return NextResponse.next();

}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|logo|public).*)"
    ]
};
