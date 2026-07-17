"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { menu } from "@/config/menu";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0B4F8A] text-white flex flex-col h-screen shadow-xl">

      {/* Logo */}
      <div className="flex items-center justify-center border-b border-blue-700 p-6">
        <Image
          src="/logo/logo-horizontal.png"
          alt="Colegio Nuevo San Luis Gonzaga"
          width={180}
          height={70}
          priority
          className="h-auto w-auto"
        />
      </div>

      {/* Menú */}
      <nav className="flex-1 mt-5 px-3">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                mb-2
                transition-all
                duration-200

                ${
                  active
                    ? "bg-white text-[#0B4F8A] shadow-lg"
                    : "hover:bg-[#1565A9]"
                }
              `}
            >

              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>

            </Link>

          );

        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-blue-700 p-5 text-center">

        <p className="text-sm opacity-80">

          SCA WEB

        </p>

        <p className="text-xs opacity-60">

          Versión 0.2.0

        </p>

      </div>

    </aside>
  );
}