"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, UserCircle } from "lucide-react";

import { SessionPayload } from "@/lib/auth";

const ROL_LABEL: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  COORDINADOR: "Coordinador",
  CONSULTA: "Consulta"
};

interface Props {
  user: SessionPayload | null;
}

export default function Header({ user }: Props) {

  const router = useRouter();

  async function handleLogout() {

    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/login");
    router.refresh();

  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-[#0B4F8A]">
          Sistema de Control de Asistencia
        </h1>
        <p className="text-sm text-gray-500">
          Colegio Nuevo San Luis Gonzaga
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-gray-600 cursor-pointer" size={22} />

        <div className="flex items-center gap-2">
          <UserCircle size={34} className="text-[#0B4F8A]" />

          <div className="leading-tight">
            <p className="font-semibold">{user?.nombre ?? "Invitado"}</p>
            <p className="text-xs text-gray-500">
              {user ? (ROL_LABEL[user.rol] ?? user.rol) : ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="rounded-full p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
