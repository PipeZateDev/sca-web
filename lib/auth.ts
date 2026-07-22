import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { Role } from "@/types/user";

export const SESSION_COOKIE = "sca_session";

const SESSION_DURATION = "8h";

export interface SessionPayload {
    userId: string;
    usuario: string;
    nombre: string;
    rol: Role;
}

function getSecret(): string {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Falta la variable JWT_SECRET");
    }

    return secret;

}

export async function hashPassword(password: string): Promise<string> {

    return bcrypt.hash(password, 10);

}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {

    return bcrypt.compare(password, hash);

}

export function createSessionToken(payload: SessionPayload): string {

    return jwt.sign(payload, getSecret(), { expiresIn: SESSION_DURATION });

}

export function verifySessionToken(token: string): SessionPayload | null {

    try {

        return jwt.verify(token, getSecret()) as SessionPayload;

    } catch {

        return null;

    }

}

export async function getSessionUser(): Promise<SessionPayload | null> {

    const store = await cookies();

    const token = store.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    return verifySessionToken(token);

}

export async function requireAdmin(): Promise<SessionPayload | null> {

    const session = await getSessionUser();

    if (!session || session.rol !== "ADMINISTRADOR") return null;

    return session;

}
