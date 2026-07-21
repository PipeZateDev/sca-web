"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
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
            <p className="font-semibold">Administrador</p>
            <p className="text-xs text-gray-500">
              administrador@colegio.edu.co
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}