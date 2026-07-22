"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, UserCircle, ChevronDown } from "lucide-react";

import { SessionPayload } from "@/lib/auth";

const ROL_LABEL: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  COORDINADOR: "Coordinador",
  CONSULTA: "Consulta"
};

interface Props {
  user: SessionPayload | null;
  onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: Props) {

  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">

      <div className="flex min-w-0 items-center gap-3">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-[#0B4F8A] sm:text-xl">
            Sistema de Control de Asistencia
          </h1>
          <p className="hidden truncate text-sm text-gray-500 sm:block">
            Colegio Nuevo San Luis Gonzaga
          </p>
        </div>

      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        <Bell className="hidden text-gray-600 sm:block" size={22} />

        <div className="relative">

          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100"
          >

            <UserCircle size={32} className="text-[#0B4F8A]" />

            <div className="hidden text-left leading-tight sm:block">
              <p className="font-semibold">{user?.nombre ?? "Invitado"}</p>
              <p className="text-xs text-gray-500">
                {user ? (ROL_LABEL[user.rol] ?? user.rol) : ""}
              </p>
            </div>

            <ChevronDown size={16} className="hidden text-gray-400 sm:block" />

          </button>

          {menuAbierto && (

            <>

              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuAbierto(false)}
              />

              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border bg-white py-2 shadow-lg">

                <div className="border-b px-4 pb-2 sm:hidden">
                  <p className="truncate font-semibold">{user?.nombre ?? "Invitado"}</p>
                  <p className="text-xs text-gray-500">
                    {user ? (ROL_LABEL[user.rol] ?? user.rol) : ""}
                  </p>
                </div>

                <Link
                  href="/perfil"
                  onClick={() => setMenuAbierto(false)}
                  className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-slate-50"
                >
                  Mi Perfil
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </header>
  );
}
